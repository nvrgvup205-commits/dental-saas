import { supabase } from './supabase'
import { isReservedSlug } from './reservedSlugs'

export const TRIAL_DAYS = 14

export function trialEndsAt(from = new Date()) {
  const end = new Date(from)
  end.setDate(end.getDate() + TRIAL_DAYS)
  end.setHours(23, 59, 59, 999)
  return end
}

/** Arabic → latin slug base (without unique suffix). */
export function slugifyClinicName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[\u0600-\u06FF]/g, (c) => {
      const map = {
        ا: 'a', ب: 'b', ت: 't', ث: 'th', ج: 'g', ح: 'h', خ: 'kh', د: 'd', ذ: 'th',
        ر: 'r', ز: 'z', س: 's', ش: 'sh', ص: 's', ض: 'd', ط: 't', ظ: 'z', ع: 'a',
        غ: 'gh', ف: 'f', ق: 'q', ك: 'k', ل: 'l', م: 'm', ن: 'n', ه: 'h', و: 'w',
        ي: 'y', ة: 'h', ى: 'a', ء: '', أ: 'a', إ: 'a', آ: 'a', ؤ: 'o', ئ: 'e',
      }
      return map[c] || ''
    })
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 24)
}

export function normalizeUsername(value) {
  return String(value || '').trim().replace(/\s+/g, '')
}

export function digitsOnly(value) {
  return String(value || '').replace(/\D/g, '')
}

async function slugTaken(slug) {
  if (!slug || isReservedSlug(slug)) return true
  const { data, error } = await supabase.from('clinics').select('id').eq('slug', slug).maybeSingle()
  if (error) throw error
  return !!data
}

export async function allocateUniqueSlug(name) {
  const base = slugifyClinicName(name) || 'clinic'
  for (let i = 0; i < 12; i += 1) {
    const suffix = Math.random().toString(36).substring(2, 5)
    const candidate = `${base}-${suffix}`
    if (!(await slugTaken(candidate))) return candidate
  }
  throw new Error('تعذر إنشاء رابط فريد للعيادة — حاول مرة أخرى')
}

/**
 * Creates a clinic on a 14-day trial with clinic_admin + sample doctor.
 * Returns { clinic, staffPath, patientPath, trialEndsAt }.
 */
export async function createClinicTrial({
  name,
  phone,
  whatsapp,
  email,
  username,
  password,
}) {
  const clinicName = String(name || '').trim()
  const phoneValue = String(phone || '').trim()
  const adminUser = normalizeUsername(username) || digitsOnly(phoneValue)
  const adminPass = String(password || '').trim()

  if (!clinicName) throw new Error('اكتب اسم العيادة')
  if (!phoneValue) throw new Error('اكتب رقم الجوال')
  if (!adminUser || adminUser.length < 3) throw new Error('اسم المستخدم قصير جدًا')
  if (!adminPass || adminPass.length < 4) throw new Error('كلمة المرور لازم 4 أحرف على الأقل')

  const slug = await allocateUniqueSlug(clinicName)
  const ends = trialEndsAt()
  const endsIso = ends.toISOString()

  const basePayload = {
    name: clinicName,
    slug,
    phone: phoneValue,
    whatsapp: String(whatsapp || phoneValue).trim(),
    email: String(email || '').trim() || null,
    primary_color: '#0EA5E9',
    subscription_status: 'trial',
  }

  const withExtras = {
    ...basePayload,
    about: `تجربة مجانية ${TRIAL_DAYS} يوم — تنتهي ${ends.toLocaleDateString('ar-SA')}`,
    trial_ends_at: endsIso,
  }

  async function insertClinic(payload) {
    const { data, error } = await supabase.from('clinics').insert([payload]).select().single()
    if (error) throw error
    return data
  }

  let clinic
  try {
    clinic = await insertClinic(withExtras)
  } catch (err) {
    const msg = err?.message || ''
    if (msg.includes('trial_ends_at') || msg.includes('about')) {
      const fallback = { ...basePayload }
      if (!msg.includes('about')) fallback.about = withExtras.about
      try {
        clinic = await insertClinic(fallback)
      } catch (err2) {
        if (err2?.message?.includes('about')) {
          clinic = await insertClinic(basePayload)
        } else {
          throw err2
        }
      }
    } else {
      throw err
    }
  }

  const adminRow = {
    clinic_id: clinic.id,
    username: adminUser,
    password: adminPass,
    full_name: 'مدير العيادة',
    role: 'clinic_admin',
  }

  let { error: adminErr } = await supabase.from('admin_users').insert([adminRow])
  if (adminErr?.message?.includes('full_name')) {
    delete adminRow.full_name
    ;({ error: adminErr } = await supabase.from('admin_users').insert([adminRow]))
  }
  if (adminErr) {
    await supabase.from('clinics').delete().eq('id', clinic.id)
    if (/duplicate|unique|already/i.test(adminErr.message || '')) {
      throw new Error('اسم المستخدم مستخدم من قبل — جرّب اسمًا ثاني')
    }
    throw adminErr
  }

  const { error: doctorErr } = await supabase.from('doctors').insert([{
    clinic_id: clinic.id,
    name: 'د. مثال',
    specialization: 'عام',
    username: adminUser,
    password: adminPass,
  }])
  if (doctorErr) {
    // Non-fatal for access — admin can still log in; surface lightly
    console.warn('doctor seed failed', doctorErr)
  }

  return {
    clinic,
    username: adminUser,
    password: adminPass,
    trialEndsAt: ends,
    staffPath: `/${clinic.slug}/staff`,
    patientPath: `/${clinic.slug}`,
    aboutPath: `/${clinic.slug}/about`,
  }
}
