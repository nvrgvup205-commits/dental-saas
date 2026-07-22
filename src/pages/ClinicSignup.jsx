import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, CheckCircle, Copy, ExternalLink, Lock, Sparkles, Stethoscope,
} from 'lucide-react'
import { createClinicTrial, digitsOnly, TRIAL_DAYS } from '../lib/clinicSignup'

export default function ClinicSignup() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    username: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState('')

  const suggestedUser = useMemo(() => digitsOnly(form.phone), [form.phone])

  const onChange = (key) => (e) => {
    const value = e.target.value
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'phone' && (!prev.username || prev.username === digitsOnly(prev.phone))) {
        next.username = digitsOnly(value)
      }
      return next
    })
  }

  const copyText = async (label, text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
      setTimeout(() => setCopied(''), 2000)
    } catch {
      setCopied('')
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const created = await createClinicTrial({
        name: form.name,
        phone: form.phone,
        whatsapp: form.phone,
        email: form.email,
        username: form.username || suggestedUser,
        password: form.password,
      })
      setResult(created)
    } catch (err) {
      setError(err?.message || 'حصل خطأ أثناء التسجيل')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-sky-50 via-cyan-50 to-emerald-50" dir="rtl">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="floating-shape w-[420px] h-[420px] bg-sky-400/20 top-0 -right-24" />
        <div className="floating-shape w-[420px] h-[420px] bg-cyan-400/20 bottom-0 -left-24" style={{ animationDelay: '2s' }} />
      </div>

      <Link
        to="/dental"
        className="fixed top-6 right-6 z-50 px-4 py-2 bg-white/80 hover:bg-sky-100 backdrop-blur-xl rounded-full border-2 border-sky-200 hover:border-sky-400 flex items-center gap-2 transition-all shadow-lg text-sky-700 font-bold text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        رجوع
      </Link>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto gradient-medical rounded-2xl shadow-xl flex items-center justify-center mb-4">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">سجّل عيادتك الآن</h1>
            <p className="text-slate-600 font-medium">
              تجربة مجانية {TRIAL_DAYS} يوم — بدون بطاقة، وتدخل لوحة العيادة مباشرة.
            </p>
          </div>

          {!result ? (
            <form onSubmit={submit} className="bg-white/90 backdrop-blur-xl border-2 border-sky-200 rounded-3xl p-6 md:p-8 shadow-2xl space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">اسم العيادة *</label>
                <input
                  required
                  value={form.name}
                  onChange={onChange('name')}
                  placeholder="عيادة الابتسامة"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl input-medical outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">رقم الجوال *</label>
                <input
                  required
                  inputMode="tel"
                  value={form.phone}
                  onChange={onChange('phone')}
                  placeholder="05xxxxxxxx"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl input-medical outline-none"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">البريد (اختياري)</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={onChange('email')}
                  placeholder="clinic@email.com"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl input-medical outline-none"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">اسم المستخدم *</label>
                  <input
                    required
                    value={form.username}
                    onChange={onChange('username')}
                    placeholder={suggestedUser || 'username'}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl input-medical outline-none font-mono"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">كلمة المرور *</label>
                  <input
                    required
                    type="password"
                    minLength={4}
                    value={form.password}
                    onChange={onChange('password')}
                    placeholder="••••"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl input-medical outline-none"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-sky-50 border border-sky-100 px-4 py-3 text-sm text-sky-800 font-medium flex items-start gap-2">
                <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-sky-600" />
                <span>بعد التسجيل نفتح لك عيادة بحالة تجربة {TRIAL_DAYS} يوم وتقدر تدخل من بوابة الطاقم فورًا.</span>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 p-3 rounded-2xl text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 gradient-medical text-white rounded-xl font-black shadow-xl btn-medical disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'جاري فتح التجربة…' : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    ابدأ التجربة المجانية
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="bg-white/90 backdrop-blur-xl border-2 border-emerald-200 rounded-3xl p-6 md:p-8 shadow-2xl space-y-5 animate-slide-up">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-1">عيادتك جاهزة</h2>
                <p className="text-slate-600 text-sm">
                  التجربة حتى {result.trialEndsAt.toLocaleDateString('ar-SA')} ({TRIAL_DAYS} يوم)
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <ResultRow
                  label="اسم العيادة"
                  value={result.clinic.name}
                />
                <ResultRow
                  label="المستخدم"
                  value={result.username}
                  onCopy={() => copyText('user', result.username)}
                  copied={copied === 'user'}
                />
                <ResultRow
                  label="كلمة المرور"
                  value={result.password}
                  onCopy={() => copyText('pass', result.password)}
                  copied={copied === 'pass'}
                />
              </div>

              <div className="grid gap-2">
                <a
                  href={result.staffPath}
                  className="w-full py-3.5 gradient-medical text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  دخول بوابة الطاقم
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href={result.patientPath}
                  className="w-full py-3.5 bg-white border-2 border-sky-200 text-sky-800 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sky-50"
                >
                  رابط بوابة المرضى
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <p className="text-center text-xs text-slate-500">
                احفظ بيانات الدخول — تقدر ترجع لأي وقت عبر رابط عيادتك.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ResultRow({ label, value, onCopy, copied }) {
  return (
    <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3 border border-slate-100">
      <span className="text-slate-500 font-bold min-w-[5.5rem]">{label}</span>
      <code className="flex-1 text-slate-800 font-mono text-sm truncate" dir="ltr">{value}</code>
      {onCopy && (
        <button type="button" onClick={onCopy} className="p-2 rounded-lg bg-sky-100 text-sky-700 hover:bg-sky-200" title="نسخ">
          {copied ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        </button>
      )}
    </div>
  )
}
