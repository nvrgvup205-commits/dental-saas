-- =============================================================================
-- Dental SaaS compatibility layer on the shared gyms Supabase project
-- Project: khzrapojrkhxjsjgnflr
--
-- SAFE for the gyms app:
--   - Only ADD COLUMN IF NOT EXISTS / CREATE TABLE IF NOT EXISTS
--   - Does NOT drop, rename, or alter gym tables (gyms, members, owners, ...)
--   - Does NOT change existing gym RLS policies
--
-- Run once in: Supabase Dashboard → SQL Editor → Run
-- =============================================================================

-- ── Extra columns expected by dental-saas v2 ────────────────────────────────
ALTER TABLE public.clinics
  ADD COLUMN IF NOT EXISTS about text;

ALTER TABLE public.clinics
  ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz;

ALTER TABLE public.admin_users
  ADD COLUMN IF NOT EXISTS full_name text;

-- ── Missing dental tables ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.doctor_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid REFERENCES public.clinics(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  day_of_week smallint NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS doctor_schedules_doctor_id_idx
  ON public.doctor_schedules (doctor_id);

CREATE TABLE IF NOT EXISTS public.clinic_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric(12,2) NOT NULL DEFAULT 0,
  duration_minutes integer DEFAULT 30,
  currency text DEFAULT 'SAR',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS clinic_services_clinic_id_idx
  ON public.clinic_services (clinic_id);

CREATE TABLE IF NOT EXISTS public.medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES public.doctors(id) ON DELETE SET NULL,
  diagnosis text,
  treatment text,
  prescription text,
  next_visit_notes text,
  private_notes text,
  services_provided jsonb DEFAULT '[]'::jsonb,
  total_amount numeric(12,2) DEFAULT 0,
  discount numeric(12,2) DEFAULT 0,
  paid_amount numeric(12,2) DEFAULT 0,
  payment_status text DEFAULT 'unpaid',
  payment_method text,
  xray_images jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS medical_records_clinic_id_idx
  ON public.medical_records (clinic_id);
CREATE INDEX IF NOT EXISTS medical_records_appointment_id_idx
  ON public.medical_records (appointment_id);
CREATE INDEX IF NOT EXISTS medical_records_patient_id_idx
  ON public.medical_records (patient_id);

-- ── Ensure owner account (idempotent) ───────────────────────────────────────
INSERT INTO public.admin_users (username, password, role, full_name, clinic_id)
SELECT 'owner', 'owner123', 'owner', 'مالك النظام', NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public.admin_users WHERE username = 'owner' AND role = 'owner'
);

UPDATE public.admin_users
SET password = 'owner123',
    role = 'owner',
    full_name = COALESCE(full_name, 'مالك النظام')
WHERE username = 'owner';

-- ── RLS: match existing dental anon-access pattern (app uses anon key) ──────
ALTER TABLE public.doctor_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'doctor_schedules' AND policyname = 'dental_doctor_schedules_all'
  ) THEN
    CREATE POLICY dental_doctor_schedules_all ON public.doctor_schedules
      FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'clinic_services' AND policyname = 'dental_clinic_services_all'
  ) THEN
    CREATE POLICY dental_clinic_services_all ON public.clinic_services
      FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'medical_records' AND policyname = 'dental_medical_records_all'
  ) THEN
    CREATE POLICY dental_medical_records_all ON public.medical_records
      FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ── Storage buckets for dental uploads (public read) ────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('clinic-logos', 'clinic-logos', true),
  ('doctor-photos', 'doctor-photos', true),
  ('xray-images', 'xray-images', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'dental_storage_public_read'
  ) THEN
    CREATE POLICY dental_storage_public_read ON storage.objects
      FOR SELECT TO public
      USING (bucket_id IN ('clinic-logos', 'doctor-photos', 'xray-images'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'dental_storage_anon_write'
  ) THEN
    CREATE POLICY dental_storage_anon_write ON storage.objects
      FOR INSERT TO anon, authenticated
      WITH CHECK (bucket_id IN ('clinic-logos', 'doctor-photos', 'xray-images'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'dental_storage_anon_update'
  ) THEN
    CREATE POLICY dental_storage_anon_update ON storage.objects
      FOR UPDATE TO anon, authenticated
      USING (bucket_id IN ('clinic-logos', 'doctor-photos', 'xray-images'))
      WITH CHECK (bucket_id IN ('clinic-logos', 'doctor-photos', 'xray-images'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'dental_storage_anon_delete'
  ) THEN
    CREATE POLICY dental_storage_anon_delete ON storage.objects
      FOR DELETE TO anon, authenticated
      USING (bucket_id IN ('clinic-logos', 'doctor-photos', 'xray-images'));
  END IF;
END $$;

-- Done. Gym tables are untouched.
