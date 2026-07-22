-- Optional re-seed helper for smile-clinic demo credentials (all 1111).
-- Safe to re-run: updates existing demo rows; does not touch gym tables.

UPDATE public.admin_users
SET username = '1111', password = '1111', full_name = COALESCE(full_name, 'مالك النظام')
WHERE role = 'owner';

UPDATE public.admin_users
SET username = '1111', password = '1111', full_name = COALESCE(full_name, 'مدير العيادة')
WHERE role = 'clinic_admin';

UPDATE public.doctors
SET username = '1111', password = '1111', phone = '1111'
WHERE clinic_id IN (SELECT id FROM public.clinics WHERE slug = 'smile-clinic');

UPDATE public.patients
SET password = '1111'
WHERE clinic_id IN (SELECT id FROM public.clinics WHERE slug = 'smile-clinic');

UPDATE public.patients
SET phone = '1111', national_id = '1111'
WHERE id = (
  SELECT id FROM public.patients
  WHERE clinic_id IN (SELECT id FROM public.clinics WHERE slug = 'smile-clinic')
  ORDER BY created_at
  LIMIT 1
);
