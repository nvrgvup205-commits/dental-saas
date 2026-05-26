import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  User, Lock, Phone, CreditCard, Calendar, Heart, AlertCircle,
  LogOut, Plus, CheckCircle, XCircle, Clock, FileText,
  ArrowLeft, ArrowRight, Sparkles, Stethoscope, Activity,
  ShieldCheck, Settings, Eye, EyeOff, Home, Info, Pill,
  DollarSign, Receipt, X, ChevronRight, ChevronLeft
} from 'lucide-react'

export default function PatientPortal() {
  const { clinicSlug } = useParams()
  const [clinic, setClinic] = useState(null)
  const [clinicLoading, setClinicLoading] = useState(true)
  const [clinicError, setClinicError] = useState(false)
  const [view, setView] = useState('welcome')
  const [currentPatient, setCurrentPatient] = useState(null)

  useEffect(() => { loadClinic() }, [clinicSlug])

  const loadClinic = async () => {
    setClinicLoading(true)
    const { data, error } = await supabase
      .from('clinics').select('*')
      .eq('slug', clinicSlug).eq('is_active', true).maybeSingle()

    if (error || !data) { setClinicError(true) }
    else {
      setClinic(data)
      const saved = localStorage.getItem(`patient_session_${data.id}`)
      if (saved) {
        try {
          setCurrentPatient(JSON.parse(saved))
          setView('dashboard')
        } catch (e) {}
      }
    }
    setClinicLoading(false)
  }

  const handleLogout = () => {
    if (clinic) localStorage.removeItem(`patient_session_${clinic.id}`)
    setCurrentPatient(null); setView('welcome')
  }

  const handleLoginSuccess = (patient) => {
    if (clinic) localStorage.setItem(`patient_session_${clinic.id}`, JSON.stringify(patient))
    setCurrentPatient(patient); setView('dashboard')
  }

  if (clinicLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg-animated">
        <div className="text-center text-white">
          <div className="inline-block w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="mt-4 font-medium">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (clinicError || !clinic) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg-animated p-4">
        <div className="glass rounded-3xl p-12 max-w-md w-full text-center shadow-2xl">
          <div className="text-7xl mb-4">😕</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">العيادة غير موجودة</h2>
          <Link to="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl btn-glow">
            <Home className="w-5 h-5" /> الرئيسية
          </Link>
        </div>
      </div>
    )
  }

  const primary = clinic.primary_color || '#6366F1'

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 -z-10"
        style={{ background: `linear-gradient(-45deg, ${primary}, ${primary}cc, #ec4899, #4facfe)`, backgroundSize: '400% 400%', animation: 'gradient 15s ease infinite' }}></div>
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="floating-shape w-96 h-96 bg-purple-300 top-10 -right-20"></div>
        <div className="floating-shape w-80 h-80 bg-pink-300 bottom-20 -left-20" style={{animationDelay: '2s'}}></div>
      </div>

      {view === 'welcome' && <WelcomeScreen clinic={clinic} onLogin={() => setView('login')} onRegister={() => setView('register')} />}
      {view === 'login' && <LoginScreen clinic={clinic} onBack={() => setView('welcome')} onSuccess={handleLoginSuccess} onRegister={() => setView('register')} />}
      {view === 'register' && <RegisterScreen clinic={clinic} onBack={() => setView('welcome')} onSuccess={handleLoginSuccess} onLogin={() => setView('login')} />}
      {view === 'dashboard' && <Dashboard patient={currentPatient} clinic={clinic} onLogout={handleLogout} setPatient={setCurrentPatient} />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// Welcome
// ═══════════════════════════════════════════════════════════
function WelcomeScreen({ clinic, onLogin, onRegister }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 page-enter">
      <div className="w-full max-w-md">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-block mb-6 relative">
            <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl"></div>
            <div className="relative w-28 h-28 mx-auto bg-white rounded-3xl shadow-2xl flex items-center justify-center text-7xl animate-float">🦷</div>
          </div>
          <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">{clinic.name}</h1>
          <p className="text-white/90 text-lg font-medium">أهلاً بك في عيادتنا</p>
          <Link to={`/${clinic.slug}/about`} className="inline-flex items-center gap-1 mt-3 text-white/90 hover:text-white text-sm bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full backdrop-blur transition">
            <Info className="w-4 h-4" /> عن العيادة
          </Link>
        </div>

        <div className="space-y-4 animate-slide-up">
          <button onClick={onLogin} className="w-full glass rounded-2xl p-6 text-right card-hover btn-glow group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-xl">تسجيل الدخول</h3>
                  <p className="text-gray-600 text-sm">عميل مسجل بالفعل</p>
                </div>
              </div>
              <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 group-hover:-translate-x-1 transition" />
            </div>
          </button>

          <button onClick={onRegister} className="w-full glass rounded-2xl p-6 text-right card-hover btn-glow group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition">
                  <Plus className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-xl">مريض جديد</h3>
                  <p className="text-gray-600 text-sm">سجّل حسابك لأول مرة</p>
                </div>
              </div>
              <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:text-pink-600 group-hover:-translate-x-1 transition" />
            </div>
          </button>
        </div>

        <div className="text-center mt-8 space-y-2">
          <Link to="/" className="text-white/70 hover:text-white text-sm inline-flex items-center gap-1">
            <Home className="w-4 h-4" /> اختيار عيادة أخرى
          </Link>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// Login
// ═══════════════════════════════════════════════════════════
function LoginScreen({ clinic, onBack, onSuccess, onRegister }) {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const { data, error: dbError } = await supabase.from('patients').select('*')
        .eq('clinic_id', clinic.id).eq('phone', phone.trim()).eq('password', password).limit(1)
      if (dbError) throw dbError
      if (!data || data.length === 0) { setError('❌ رقم الجوال أو كلمة المرور غير صحيحة'); setLoading(false); return }
      onSuccess({ ...data[0], clinics: clinic })
    } catch (err) { setError('❌ حصل خطأ، حاول مرة أخرى') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 page-enter">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="text-white/90 hover:text-white flex items-center gap-2 mb-6 transition group">
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" /><span>رجوع</span>
        </button>

        <div className="glass rounded-3xl p-8 shadow-2xl animate-slide-up">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl mb-4">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-1">تسجيل الدخول</h2>
            <p className="text-sm text-gray-500">{clinic.name}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">رقم الجوال</label>
              <div className="relative">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05xxxxxxxx" required disabled={loading}
                  className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-indigo-500 input-glow outline-none transition font-medium" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" required disabled={loading}
                  className="w-full pr-12 pl-12 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-indigo-500 input-glow outline-none transition font-medium" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-2xl text-sm font-medium animate-fade-in">{error}</div>}

            <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl btn-glow disabled:opacity-50 shadow-xl text-lg">
              {loading ? '⏳ جاري الدخول...' : '🚀 دخول'}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">لسه ما عندكش حساب؟ <button onClick={onRegister} className="text-indigo-600 font-bold hover:underline">سجّل الآن</button></p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// Register
// ═══════════════════════════════════════════════════════════
function RegisterScreen({ clinic, onBack, onSuccess, onLogin }) {
  const [form, setForm] = useState({
    name: '', phone: '', national_id: '', date_of_birth: '', gender: 'male',
    blood_type: '', allergies: '', medical_notes: '', password: '', password_confirm: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const update = (field, value) => setForm({ ...form, [field]: value })

  const handleRegister = async (e) => {
    e.preventDefault(); setError('')
    if (form.password !== form.password_confirm) { setError('❌ كلمة المرور وتأكيدها غير متطابقين'); return }
    if (form.password.length < 4) { setError('❌ كلمة المرور يجب أن تكون 4 أحرف على الأقل'); return }
    setLoading(true)
    try {
      const { data: existPhone } = await supabase.from('patients').select('id').eq('clinic_id', clinic.id).eq('phone', form.phone.trim()).limit(1)
      if (existPhone && existPhone.length > 0) { setError('❌ هذا الرقم مسجل بالفعل في هذه العيادة'); setLoading(false); return }
      if (form.national_id.trim()) {
        const { data: existId } = await supabase.from('patients').select('id').eq('clinic_id', clinic.id).eq('national_id', form.national_id.trim()).limit(1)
        if (existId && existId.length > 0) { setError('❌ رقم الهوية مسجل بالفعل'); setLoading(false); return }
      }
      const { data, error: insertError } = await supabase.from('patients').insert([{
        clinic_id: clinic.id, name: form.name.trim(), phone: form.phone.trim(),
        national_id: form.national_id.trim() || null, date_of_birth: form.date_of_birth || null,
        gender: form.gender, blood_type: form.blood_type || null,
        allergies: form.allergies || null, medical_notes: form.medical_notes || null, password: form.password
      }]).select().single()
      if (insertError) throw insertError
      onSuccess({ ...data, clinics: clinic })
    } catch (err) { setError('❌ ' + (err.message || 'حصل خطأ')) }
    finally { setLoading(false) }
  }

  const goToStep2 = (e) => {
    e.preventDefault(); setError('')
    if (!form.name || !form.phone || !form.password) { setError('❌ الرجاء ملء كل الحقول الإلزامية'); return }
    setStep(2)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8 page-enter">
      <div className="w-full max-w-lg">
        <button onClick={step === 2 ? () => setStep(1) : onBack} className="text-white/90 hover:text-white flex items-center gap-2 mb-4 transition group">
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" /><span>رجوع</span>
        </button>

        <div className="glass rounded-3xl p-8 shadow-2xl animate-slide-up">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl flex items-center justify-center shadow-xl mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-1">تسجيل مريض جديد</h2>
            <p className="text-sm text-gray-500">{clinic.name} • خطوة {step} من 2</p>
            <div className="flex gap-2 mt-4 max-w-xs mx-auto">
              <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-gradient-to-r from-pink-500 to-rose-600' : 'bg-gray-200'}`}></div>
              <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-gradient-to-r from-pink-500 to-rose-600' : 'bg-gray-200'}`}></div>
            </div>
          </div>

          {step === 1 && (
            <form onSubmit={goToStep2} className="space-y-4">
              <Field label="الاسم الكامل *" icon={<User className="w-5 h-5" />}>
                <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="مثال: محمد أحمد" required
                  className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-pink-500 input-glow outline-none transition font-medium" />
              </Field>
              <Field label="رقم الجوال *" icon={<Phone className="w-5 h-5" />}>
                <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="05xxxxxxxx" required
                  className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-pink-500 input-glow outline-none transition font-medium" />
              </Field>
              <Field label="رقم الهوية / الإقامة" icon={<CreditCard className="w-5 h-5" />}>
                <input type="text" value={form.national_id} onChange={(e) => update('national_id', e.target.value)} placeholder="اختياري"
                  className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-pink-500 input-glow outline-none transition font-medium" />
              </Field>
              <Field label="كلمة المرور *" icon={<Lock className="w-5 h-5" />}>
                <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="على الأقل 4 أحرف" required
                  className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-pink-500 input-glow outline-none transition font-medium" />
              </Field>
              <Field label="تأكيد كلمة المرور *" icon={<Lock className="w-5 h-5" />}>
                <input type="password" value={form.password_confirm} onChange={(e) => update('password_confirm', e.target.value)} placeholder="أعد كتابة كلمة المرور" required
                  className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-pink-500 input-glow outline-none transition font-medium" />
              </Field>

              {error && <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-2xl text-sm font-medium animate-fade-in">{error}</div>}

              <button type="submit" className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-2xl btn-glow shadow-xl text-lg">التالي ←</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleRegister} className="space-y-4">
              <Field label="تاريخ الميلاد" icon={<Calendar className="w-5 h-5" />}>
                <input type="date" value={form.date_of_birth} onChange={(e) => update('date_of_birth', e.target.value)}
                  className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-pink-500 input-glow outline-none transition font-medium" />
              </Field>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الجنس</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => update('gender', 'male')}
                    className={`py-4 rounded-2xl font-bold transition ${form.gender === 'male' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl scale-105' : 'bg-white/80 text-gray-700 border-2 border-gray-200'}`}>👨 ذكر</button>
                  <button type="button" onClick={() => update('gender', 'female')}
                    className={`py-4 rounded-2xl font-bold transition ${form.gender === 'female' ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-xl scale-105' : 'bg-white/80 text-gray-700 border-2 border-gray-200'}`}>👩 أنثى</button>
                </div>
              </div>
              <Field label="فصيلة الدم" icon={<Heart className="w-5 h-5" />}>
                <select value={form.blood_type} onChange={(e) => update('blood_type', e.target.value)}
                  className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-pink-500 input-glow outline-none transition font-medium">
                  <option value="">اختياري</option>
                  <option value="A+">A+</option><option value="A-">A-</option>
                  <option value="B+">B+</option><option value="B-">B-</option>
                  <option value="AB+">AB+</option><option value="AB-">AB-</option>
                  <option value="O+">O+</option><option value="O-">O-</option>
                </select>
              </Field>
              <Field label="الحساسيات" icon={<AlertCircle className="w-5 h-5" />}>
                <input type="text" value={form.allergies} onChange={(e) => update('allergies', e.target.value)} placeholder="مثال: البنسلين..."
                  className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-pink-500 input-glow outline-none transition font-medium" />
              </Field>
              <Field label="ملاحظات طبية" icon={<FileText className="w-5 h-5" />}>
                <textarea value={form.medical_notes} onChange={(e) => update('medical_notes', e.target.value)} placeholder="أمراض مزمنة، أدوية..." rows="3"
                  className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-pink-500 input-glow outline-none transition font-medium resize-none" />
              </Field>

              {error && <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-2xl text-sm font-medium animate-fade-in">{error}</div>}

              <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl btn-glow disabled:opacity-50 shadow-xl text-lg">
                {loading ? '⏳ جاري التسجيل...' : '✅ إنشاء الحساب'}
              </button>
            </form>
          )}

          {step === 1 && (
            <div className="text-center mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm">عندك حساب بالفعل؟ <button onClick={onLogin} className="text-pink-600 font-bold hover:underline">سجّل دخول</button></p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, icon, children }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">{icon}</div>
        {children}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// Dashboard
// ═══════════════════════════════════════════════════════════
function Dashboard({ patient, clinic, onLogout, setPatient }) {
  const [appointments, setAppointments] = useState([])
  const [complaints, setComplaints] = useState([])
  const [activeTab, setActiveTab] = useState('home')
  const [loading, setLoading] = useState(true)
  const [viewingApt, setViewingApt] = useState(null)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    const [apptsRes, complsRes] = await Promise.all([
      supabase.from('appointments').select('*, doctors(*), medical_records(*)').eq('patient_id', patient.id).order('appointment_date', { ascending: false }),
      supabase.from('complaints').select('*').eq('patient_id', patient.id).order('created_at', { ascending: false })
    ])
    setAppointments(apptsRes.data || [])
    setComplaints(complsRes.data || [])
    setLoading(false)
  }

  const cancelAppointment = async (id) => {
    if (!confirm('هل تريد إلغاء هذا الموعد؟')) return
    await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', id)
    loadData()
  }

  const today = new Date().toISOString().split('T')[0]
  const upcoming = appointments.filter(a => a.appointment_date >= today && a.status !== 'cancelled')
  const past = appointments.filter(a => a.appointment_date < today || a.status === 'cancelled')

  if (viewingApt) {
    return <AppointmentDetailsView apt={viewingApt} onClose={() => setViewingApt(null)} clinic={clinic} />
  }

  return (
    <div className="min-h-screen page-enter">
      <div className="glass-dark sticky top-0 z-40 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">🦷</div>
            <div>
              <h1 className="text-white font-bold text-lg">{patient.name}</h1>
              <p className="text-white/70 text-xs">{clinic?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to={`/${clinic.slug}/about`} className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl flex items-center gap-1 transition" title="عن العيادة">
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">عن العيادة</span>
            </Link>
            <button onClick={onLogout} className="bg-white/10 hover:bg-red-500/30 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">خروج</span>
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto">
          {[
            { id: 'home', label: 'الرئيسية', icon: '🏠' },
            { id: 'appointments', label: 'مواعيدي', icon: '📅' },
            { id: 'book', label: 'حجز موعد', icon: '➕' },
            { id: 'complaints', label: 'شكاوي', icon: '⚠️' },
            { id: 'profile', label: 'بياناتي', icon: '⚙️' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-lg' : 'text-white/80 hover:bg-white/10'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {loading ? (
          <div className="text-center py-20 text-white">
            <div className="inline-block w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            <p className="mt-4 font-medium">جاري التحميل...</p>
          </div>
        ) : (
          <>
            {activeTab === 'home' && <HomeTab patient={patient} upcoming={upcoming} past={past} complaints={complaints} setActiveTab={setActiveTab} onViewApt={setViewingApt} />}
            {activeTab === 'appointments' && <AppointmentsTab upcoming={upcoming} past={past} onCancel={cancelAppointment} onView={setViewingApt} />}
            {activeTab === 'book' && <BookAppointmentTab patient={patient} clinic={clinic} onSuccess={() => { loadData(); setActiveTab('appointments'); }} />}
            {activeTab === 'complaints' && <ComplaintsTab patient={patient} clinic={clinic} complaints={complaints} onUpdate={loadData} />}
            {activeTab === 'profile' && <ProfileTab patient={patient} clinic={clinic} setPatient={setPatient} />}
          </>
        )}
      </div>
    </div>
  )
}

// Home Tab
function HomeTab({ patient, upcoming, past, complaints, setActiveTab, onViewApt }) {
  const completed = past.filter(a => a.status === 'completed').length
  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="text-6xl animate-float">👋</div>
          <div>
            <h2 className="text-3xl font-black text-gray-800">أهلاً {patient.name.split(' ')[0]}!</h2>
            <p className="text-gray-600 mt-1">سعداء برؤيتك معنا اليوم</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard icon="📅" label="مواعيد قادمة" value={upcoming.length} gradient="from-blue-500 to-indigo-600" />
        <StatCard icon="✅" label="مواعيد مكتملة" value={completed} gradient="from-green-500 to-emerald-600" />
        <StatCard icon="⚠️" label="شكاوى مفتوحة" value={complaints.filter(c => c.status === 'open').length} gradient="from-orange-500 to-red-600" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <button onClick={() => setActiveTab('book')} className="glass rounded-2xl p-6 text-right card-hover group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800">حجز موعد جديد 📅</h3>
              <p className="text-gray-600 text-sm mt-1">اختار التاريخ والوقت المتاح</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition">
              <Plus className="w-7 h-7" />
            </div>
          </div>
        </button>

        <button onClick={() => setActiveTab('complaints')} className="glass rounded-2xl p-6 text-right card-hover group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800">تقديم شكوى ⚠️</h3>
              <p className="text-gray-600 text-sm mt-1">شاركنا أي ملاحظة</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition">
              <AlertCircle className="w-7 h-7" />
            </div>
          </div>
        </button>
      </div>

      {upcoming.length > 0 && (
        <div className="glass rounded-3xl p-6 shadow-2xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600" /> موعدك القادم
          </h3>
          <AppointmentCard apt={upcoming[0]} onView={onViewApt} />
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, gradient }) {
  return (
    <div className="glass rounded-2xl p-6 card-hover">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg mb-3`}>{icon}</div>
      <p className="text-3xl font-black text-gray-800">{value}</p>
      <p className="text-gray-600 text-sm font-medium mt-1">{label}</p>
    </div>
  )
}

function AppointmentCard({ apt, onCancel, onView }) {
  const statusColors = { pending: 'from-yellow-400 to-orange-500', confirmed: 'from-green-400 to-emerald-500', completed: 'from-blue-400 to-indigo-500', cancelled: 'from-red-400 to-red-500' }
  const statusLabels = { pending: '⏳ قيد التأكيد', confirmed: '✅ مؤكد', completed: '✔️ مكتمل', cancelled: '❌ ملغي' }
  const hasRecord = apt.medical_records && apt.medical_records.length > 0

  return (
    <div className="bg-white/60 rounded-2xl p-5 border border-white/40">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-2xl font-bold text-gray-800">{apt.appointment_date}</p>
          <p className="text-gray-600">⏰ {apt.appointment_time}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${statusColors[apt.status]}`}>
          {statusLabels[apt.status]}
        </span>
      </div>
      {apt.doctors && (
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <Stethoscope className="w-4 h-4" />
          <span className="font-medium">{apt.doctors.name}</span>
          {apt.doctors.specialization && <span className="text-sm text-gray-500">• {apt.doctors.specialization}</span>}
        </div>
      )}

      <div className="flex gap-2 mt-3 flex-wrap">
        {hasRecord && onView && (
          <button onClick={() => onView(apt)} className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1">
            <Receipt className="w-4 h-4" /> عرض التقرير والفاتورة
          </button>
        )}
        {onCancel && apt.status !== 'cancelled' && apt.status !== 'completed' && (
          <button onClick={() => onCancel(apt.id)} className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-1">
            <XCircle className="w-4 h-4" /> إلغاء الموعد
          </button>
        )}
      </div>
    </div>
  )
}

function AppointmentsTab({ upcoming, past, onCancel, onView }) {
  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6 shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-indigo-600" /> المواعيد القادمة ({upcoming.length})
        </h3>
        {upcoming.length === 0 ? <EmptyState icon="📅" message="لا توجد مواعيد قادمة" /> : (
          <div className="space-y-3">
            {upcoming.map(apt => <AppointmentCard key={apt.id} apt={apt} onCancel={onCancel} onView={onView} />)}
          </div>
        )}
      </div>

      <div className="glass rounded-3xl p-6 shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6 text-gray-600" /> سجل المواعيد ({past.length})
        </h3>
        {past.length === 0 ? <EmptyState icon="📋" message="لا توجد مواعيد سابقة" /> : (
          <div className="space-y-3">
            {past.map(apt => <AppointmentCard key={apt.id} apt={apt} onView={onView} />)}
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// 📅 Book Appointment - مع تقويم بصري وأوقات متاحة
// ═══════════════════════════════════════════════════════════
function BookAppointmentTab({ patient, clinic, onSuccess }) {
  const [doctors, setDoctors] = useState([])
  const [services, setServices] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [appointmentType, setAppointmentType] = useState('first_visit')
  const [notes, setNotes] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [busySlots, setBusySlots] = useState([])
  const [doctorSchedule, setDoctorSchedule] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    Promise.all([
      supabase.from('doctors').select('*').eq('clinic_id', clinic.id).eq('is_active', true),
      supabase.from('clinic_services').select('*').eq('clinic_id', clinic.id).eq('is_active', true)
    ]).then(([d, s]) => {
      setDoctors(d.data || [])
      setServices(s.data || [])
    })
  }, [])

  useEffect(() => {
    if (selectedDoctor) {
      supabase.from('doctor_schedules').select('*').eq('doctor_id', selectedDoctor).then(({ data }) => {
        setDoctorSchedule(data || [])
      })
    }
  }, [selectedDoctor])

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      computeAvailableSlots()
    }
  }, [selectedDoctor, selectedDate, doctorSchedule])

  const computeAvailableSlots = async () => {
    const dayOfWeek = new Date(selectedDate).getDay()

    // 1) جرّب جدول الدكتور المخصص
    let schedule = doctorSchedule.find(s => s.day_of_week === dayOfWeek && s.is_available)

    // 2) لو مفيش جدول مخصص، استخدم ساعات العيادة
    if (!schedule) {
      // تأكد إن اليوم من أيام عمل العيادة
      const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
      const dayKey = dayNames[dayOfWeek]
      const workingDays = clinic.working_days || ['sat', 'sun', 'mon', 'tue', 'wed', 'thu']

      if (workingDays.includes(dayKey)) {
        schedule = {
          start_time: clinic.working_hours_start || '09:00:00',
          end_time: clinic.working_hours_end || '21:00:00'
        }
      }
    }

    if (!schedule) { setAvailableSlots([]); return }

    const slots = []
    const start = schedule.start_time.split(':').map(Number)
    const end = schedule.end_time.split(':').map(Number)
    const doctor = doctors.find(d => d.id === selectedDoctor)
    const slotDuration = doctor?.time_per_slot || 30

    let current = new Date()
    current.setHours(start[0], start[1] || 0, 0)
    const endTime = new Date()
    endTime.setHours(end[0], end[1] || 0, 0)

    // لو التاريخ هو اليوم، استبعد الأوقات اللي فاتت
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const isToday = selectedDate === today

    while (current < endTime) {
      const h = String(current.getHours()).padStart(2, '0')
      const m = String(current.getMinutes()).padStart(2, '0')

      if (!isToday || current > now) {
        slots.push(`${h}:${m}`)
      }
      current.setMinutes(current.getMinutes() + slotDuration)
    }

    const { data: busy } = await supabase.from('appointments').select('appointment_time')
      .eq('doctor_id', selectedDoctor).eq('appointment_date', selectedDate)
      .neq('status', 'cancelled')

    const busyTimes = (busy || []).map(b => b.appointment_time.substring(0, 5))
    setBusySlots(busyTimes)
    setAvailableSlots(slots)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      alert('⚠️ من فضلك اختار الطبيب والتاريخ والوقت'); return
    }
    setLoading(true)

    // إعادة التحقق من الوقت قبل الحجز (حماية ضد Race Condition)
    const { data: conflict } = await supabase.from('appointments').select('id')
      .eq('doctor_id', selectedDoctor)
      .eq('appointment_date', selectedDate)
      .eq('appointment_time', selectedTime)
      .neq('status', 'cancelled')
      .limit(1)

    if (conflict && conflict.length > 0) {
      setLoading(false)
      alert('❌ عذراً! تم حجز هذا الوقت من قِبل مريض آخر للتو.\nمن فضلك اختار وقت آخر.')
      await computeAvailableSlots() // تحديث الأوقات المتاحة
      setSelectedTime('')
      return
    }

    const { error } = await supabase.from('appointments').insert([{
      clinic_id: clinic.id, patient_id: patient.id, doctor_id: selectedDoctor,
      appointment_date: selectedDate, appointment_time: selectedTime,
      type: appointmentType, notes, status: 'pending'
    }])
    setLoading(false)

    if (!error) { setSuccess(true); setTimeout(() => onSuccess(), 1500) }
    else if (error.code === '23505') {
      // duplicate key error from Postgres
      alert('❌ هذا الوقت محجوز بالفعل. من فضلك اختار وقت آخر.')
      await computeAvailableSlots()
      setSelectedTime('')
    } else {
      alert('❌ ' + error.message)
    }
  }

  // إنشاء أيام الشهر للتقويم
  const monthDays = []
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date(); today.setHours(0, 0, 0, 0)

  for (let i = 0; i < firstDay; i++) monthDays.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    monthDays.push({ day: d, dateStr, isPast: date < today, isToday: date.getTime() === today.getTime() })
  }

  if (success) {
    return (
      <div className="glass rounded-3xl p-12 text-center shadow-2xl animate-fade-in">
        <div className="text-7xl mb-4 animate-float">🎉</div>
        <h2 className="text-3xl font-black text-gray-800 mb-2">تم الحجز بنجاح!</h2>
        <p className="text-gray-600">سيتم تأكيد موعدك قريباً</p>
      </div>
    )
  }

  const dayNames = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
  const selectedDoctorObj = doctors.find(d => d.id === selectedDoctor)

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* عنوان الصفحة */}
      <div className="glass rounded-3xl p-6 shadow-2xl text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl mb-3">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-black text-gray-800">احجز موعدك</h2>
        <p className="text-gray-600 text-sm mt-1">في 3 خطوات بسيطة</p>
      </div>

      {/* مؤشر الخطوات */}
      <div className="glass rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: 'الطبيب', done: !!selectedDoctor },
            { num: 2, label: 'التاريخ', done: !!selectedDate },
            { num: 3, label: 'الوقت', done: !!selectedTime },
          ].map((s, i, arr) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className={`flex flex-col items-center ${i < arr.length - 1 ? 'flex-1' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  s.done ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg scale-110' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {s.done ? <CheckCircle className="w-5 h-5" /> : s.num}
                </div>
                <span className={`text-xs font-bold mt-1 ${s.done ? 'text-green-600' : 'text-gray-500'}`}>{s.label}</span>
              </div>
              {i < arr.length - 1 && (
                <div className={`h-1 flex-1 mx-2 rounded-full transition-all ${
                  arr[i + 1].done || s.done ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* الخطوة 1: اختيار الطبيب */}
      <div className="glass rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">1</div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">اختر الطبيب</h3>
            <p className="text-xs text-gray-500">{doctors.length} {doctors.length === 1 ? 'طبيب متاح' : 'أطباء متاحين'}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {doctors.map(d => {
            const isSelected = selectedDoctor === d.id
            return (
              <button key={d.id} onClick={() => { setSelectedDoctor(d.id); setSelectedDate(''); setSelectedTime('') }}
                className={`relative p-4 rounded-2xl text-right transition-all duration-300 ${
                  isSelected ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-2xl scale-[1.02] ring-4 ring-indigo-200' :
                  'bg-white hover:bg-indigo-50 border-2 border-gray-100 hover:border-indigo-300 hover:shadow-lg'
                }`}>
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
                    isSelected ? 'bg-white/20' : 'bg-gradient-to-br from-indigo-100 to-purple-100'
                  }`}>👨‍⚕️</div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}>{d.name}</p>
                    <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>{d.specialization || 'طبيب عام'}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* الخطوة 2: التقويم */}
      {selectedDoctor && (
        <div className="glass rounded-3xl p-6 shadow-2xl animate-slide-up">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">2</div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">اختر التاريخ</h3>
              <p className="text-xs text-gray-500">من التقويم بالأسفل</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-3">
            <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
              className="bg-white hover:bg-pink-100 p-2 rounded-xl shadow-sm transition">
              <ChevronRight className="w-5 h-5 text-pink-600" />
            </button>
            <h4 className="font-black text-gray-800 text-lg">
              {currentMonth.toLocaleDateString('ar-EG', {month: 'long', year: 'numeric'})}
            </h4>
            <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
              className="bg-white hover:bg-pink-100 p-2 rounded-xl shadow-sm transition">
              <ChevronLeft className="w-5 h-5 text-pink-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-bold text-gray-500">
            {dayNames.map(d => <div key={d} className="py-2">{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {monthDays.map((d, i) => (
              <button key={i} disabled={!d || d.isPast}
                onClick={() => { if (d) { setSelectedDate(d.dateStr); setSelectedTime('') } }}
                className={`aspect-square rounded-xl text-sm font-bold transition-all ${
                  !d ? 'invisible' :
                  d.isPast ? 'bg-gray-50 text-gray-300 cursor-not-allowed' :
                  selectedDate === d.dateStr ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-xl scale-110 ring-4 ring-pink-200' :
                  d.isToday ? 'bg-gradient-to-br from-yellow-100 to-orange-100 text-orange-700 font-black border-2 border-orange-300 hover:scale-105' :
                  'bg-white hover:bg-pink-50 text-gray-700 border border-gray-100 hover:border-pink-300 hover:scale-105 hover:shadow-md'
                }`}>
                {d?.day}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gradient-to-br from-yellow-100 to-orange-100 border border-orange-300 rounded"></div>
              <span>اليوم</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded"></div>
              <span>المختار</span>
            </div>
          </div>
        </div>
      )}

      {/* الخطوة 3: الأوقات المتاحة */}
      {selectedDate && (
        <div className="glass rounded-3xl p-6 shadow-2xl animate-slide-up">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">3</div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">اختر الوقت</h3>
              <p className="text-xs text-gray-500">
                {availableSlots.length > 0
                  ? `${availableSlots.filter(s => !busySlots.includes(s)).length} وقت متاح من ${availableSlots.length}`
                  : 'لا توجد أوقات متاحة'}
              </p>
            </div>
          </div>

          {availableSlots.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <div className="text-6xl mb-3">😔</div>
              <p className="text-gray-700 font-bold mb-1">الطبيب غير متاح في هذا اليوم</p>
              <p className="text-gray-500 text-sm">اختار يوم آخر من التقويم</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {availableSlots.map(slot => {
                const isBusy = busySlots.includes(slot)
                const isSelected = selectedTime === slot
                return (
                  <button key={slot} disabled={isBusy} onClick={() => setSelectedTime(slot)}
                    className={`relative py-3 rounded-xl font-bold text-sm transition-all ${
                      isBusy ? 'bg-red-50 text-red-300 cursor-not-allowed line-through border border-red-100' :
                      isSelected ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl scale-110 ring-4 ring-green-200' :
                      'bg-white hover:bg-green-50 text-gray-700 border-2 border-gray-100 hover:border-green-300 hover:scale-105 hover:shadow-md'
                    }`}>
                    {isSelected && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                    )}
                    🕐 {slot}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* تفاصيل الحجز + التأكيد */}
      {selectedTime && (
        <div className="glass rounded-3xl p-6 shadow-2xl animate-fade-in">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            تفاصيل إضافية
          </h3>

          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">نوع الزيارة</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { val: 'first_visit', label: 'كشف أول', icon: '🆕', color: 'from-blue-500 to-indigo-600' },
                { val: 'follow_up', label: 'متابعة', icon: '🔄', color: 'from-green-500 to-emerald-600' },
                { val: 'emergency', label: 'طوارئ', icon: '🚨', color: 'from-red-500 to-pink-600' },
                { val: 'consultation', label: 'استشارة', icon: '💬', color: 'from-purple-500 to-pink-600' },
              ].map(t => (
                <button key={t.val} type="button" onClick={() => setAppointmentType(t.val)}
                  className={`py-3 rounded-2xl font-bold text-sm transition-all ${
                    appointmentType === t.val ? `bg-gradient-to-br ${t.color} text-white shadow-xl scale-105` :
                    'bg-white text-gray-700 border-2 border-gray-200 hover:scale-105'
                  }`}>
                  <div className="text-2xl mb-1">{t.icon}</div>
                  <div>{t.label}</div>
                </button>
              ))}
            </div>
          </div>

          <Field label="ملاحظات (اختياري)" icon={<FileText className="w-5 h-5" />}>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="أي معلومات إضافية..." rows="2"
              className="w-full pr-12 pl-4 py-3 bg-white border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-indigo-500 input-glow outline-none transition font-medium resize-none" />
          </Field>

          {/* ملخص الحجز */}
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-200 rounded-2xl p-5 mt-4 mb-4">
            <p className="text-sm font-black text-indigo-700 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              ملخص الحجز
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 bg-white/60 rounded-xl p-2">
                <Stethoscope className="w-4 h-4 text-indigo-600" />
                <span className="text-gray-600">الطبيب:</span>
                <strong className="text-gray-800">{selectedDoctorObj?.name}</strong>
              </div>
              <div className="flex items-center gap-2 bg-white/60 rounded-xl p-2">
                <Calendar className="w-4 h-4 text-pink-600" />
                <span className="text-gray-600">التاريخ:</span>
                <strong className="text-gray-800">{new Date(selectedDate).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>
              </div>
              <div className="flex items-center gap-2 bg-white/60 rounded-xl p-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="text-gray-600">الوقت:</span>
                <strong className="text-gray-800">{selectedTime}</strong>
              </div>
            </div>
          </div>

          <button onClick={submit} disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black rounded-2xl btn-glow disabled:opacity-50 shadow-2xl text-lg flex items-center justify-center gap-2">
            {loading ? '⏳ جاري الحجز...' : <><CheckCircle className="w-6 h-6" /> تأكيد الحجز</>}
          </button>
        </div>
      )}
    </div>
  )
}
// ═══════════════════════════════════════════════════════════
// 📋 Appointment Details View - عرض كامل للموعد
// ═══════════════════════════════════════════════════════════
function AppointmentDetailsView({ apt, onClose, clinic }) {
  const record = apt.medical_records?.[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 page-enter" dir="rtl">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-2xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-white font-black text-xl">📋 تفاصيل الموعد</h1>
            <p className="text-white/80 text-sm">{apt.appointment_date} • {apt.appointment_time}</p>
          </div>
          <button onClick={onClose} className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-5">
        {/* بيانات الموعد */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600" /> بيانات الموعد
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-gray-500 text-xs">التاريخ</p>
              <p className="font-bold text-gray-800">{apt.appointment_date}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-gray-500 text-xs">الوقت</p>
              <p className="font-bold text-gray-800">{apt.appointment_time}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-gray-500 text-xs">الطبيب</p>
              <p className="font-bold text-gray-800">{apt.doctors?.name}</p>
              <p className="text-xs text-gray-500">{apt.doctors?.specialization}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-gray-500 text-xs">الحالة</p>
              <p className="font-bold text-gray-800">
                {apt.status === 'pending' ? '⏳ قيد التأكيد' :
                 apt.status === 'confirmed' ? '✅ مؤكد' :
                 apt.status === 'completed' ? '✔️ مكتمل' : '❌ ملغي'}
              </p>
            </div>
          </div>
        </div>

        {record ? (
          <>
            {/* التشخيص والعلاج */}
            <div className="bg-white rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" /> التشخيص والعلاج
              </h2>
              <div className="space-y-3">
                {record.diagnosis && (
                  <div className="bg-blue-50 border-r-4 border-blue-500 rounded-xl p-4">
                    <p className="text-xs font-bold text-blue-700 mb-1">🔍 التشخيص</p>
                    <p className="text-gray-800 whitespace-pre-wrap">{record.diagnosis}</p>
                  </div>
                )}
                {record.treatment && (
                  <div className="bg-green-50 border-r-4 border-green-500 rounded-xl p-4">
                    <p className="text-xs font-bold text-green-700 mb-1">💉 العلاج المُقدّم</p>
                    <p className="text-gray-800 whitespace-pre-wrap">{record.treatment}</p>
                  </div>
                )}
                {record.prescription && (
                  <div className="bg-pink-50 border-r-4 border-pink-500 rounded-xl p-4">
                    <p className="text-xs font-bold text-pink-700 mb-1 flex items-center gap-1">
                      <Pill className="w-4 h-4" /> الوصفة الطبية
                    </p>
                    <p className="text-gray-800 whitespace-pre-wrap">{record.prescription}</p>
                  </div>
                )}
                {record.next_visit_notes && (
                  <div className="bg-yellow-50 border-r-4 border-yellow-500 rounded-xl p-4">
                    <p className="text-xs font-bold text-yellow-700 mb-1">📅 ملاحظات للزيارة القادمة</p>
                    <p className="text-gray-800 whitespace-pre-wrap">{record.next_visit_notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* الفاتورة */}
            {record.services_provided && record.services_provided.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-xl">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Receipt className="w-6 h-6 text-yellow-600" /> الفاتورة
                </h2>

                <div className="border-2 border-yellow-200 rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 border-b border-yellow-200">
                    <p className="font-bold text-gray-700 text-sm">{clinic?.name}</p>
                    <p className="text-xs text-gray-500">{record.created_at?.substring(0, 10)}</p>
                  </div>

                  <div className="p-4">
                    {record.services_provided.map((s, i) => (
                      <div key={i} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-800">{s.name} × {s.qty}</span>
                        <span className="font-bold text-gray-700">{(s.price * s.qty).toFixed(0)} ر.س</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-gray-50 space-y-1 text-sm">
                    {parseFloat(record.discount) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">الخصم:</span>
                        <span className="text-red-600 font-bold">- {parseFloat(record.discount).toFixed(0)} ر.س</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-black border-t border-gray-300 pt-2">
                      <span>الإجمالي:</span>
                      <span className="text-orange-700">{parseFloat(record.total_amount).toFixed(0)} ر.س</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المدفوع:</span>
                      <span className="text-green-600 font-bold">{parseFloat(record.paid_amount).toFixed(0)} ر.س</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المتبقي:</span>
                      <span className="font-bold">{Math.max(0, parseFloat(record.total_amount) - parseFloat(record.paid_amount)).toFixed(0)} ر.س</span>
                    </div>
                  </div>

                  <div className={`p-3 text-center font-bold text-white ${record.payment_status === 'paid' ? 'bg-green-500' : record.payment_status === 'partial' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                    {record.payment_status === 'paid' ? '✅ مدفوع بالكامل' : record.payment_status === 'partial' ? '🟡 مدفوع جزئياً' : '🔴 غير مدفوع'}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center shadow-xl">
            <div className="text-6xl mb-3">🩺</div>
            <p className="text-gray-600 font-bold">لم يتم الكشف بعد</p>
            <p className="text-gray-500 text-sm">سيظهر هنا التقرير الطبي بعد الكشف</p>
          </div>
        )}

        {apt.notes && (
          <div className="bg-white rounded-3xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" /> ملاحظاتك
            </h2>
            <p className="text-gray-700">{apt.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Complaints Tab
function ComplaintsTab({ patient, clinic, complaints, onUpdate }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ subject: '', description: '' })
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault(); setLoading(true)
    await supabase.from('complaints').insert([{
      clinic_id: clinic.id, patient_id: patient.id, subject: form.subject, description: form.description, status: 'open'
    }])
    setLoading(false); setForm({ subject: '', description: '' }); setShowForm(false); onUpdate()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">⚠️ الشكاوى</h3>
        <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-3 rounded-2xl font-bold shadow-xl btn-glow flex items-center gap-2">
          <Plus className="w-5 h-5" /> {showForm ? 'إلغاء' : 'شكوى جديدة'}
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-3xl p-6 shadow-2xl animate-slide-up">
          <form onSubmit={submit} className="space-y-4">
            <Field label="الموضوع *" icon={<FileText className="w-5 h-5" />}>
              <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="ملخص الشكوى" required
                className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-orange-500 input-glow outline-none transition font-medium" />
            </Field>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">التفاصيل *</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="اشرح المشكلة..." rows="4" required
                className="w-full px-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-orange-500 input-glow outline-none transition font-medium resize-none" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-2xl btn-glow shadow-xl">
              {loading ? '⏳ جاري الإرسال...' : '📤 إرسال الشكوى'}
            </button>
          </form>
        </div>
      )}

      <div className="glass rounded-3xl p-6 shadow-2xl">
        {complaints.length === 0 ? <EmptyState icon="✨" message="لا توجد شكاوى" /> : (
          <div className="space-y-3">
            {complaints.map(c => (
              <div key={c.id} className="bg-white/60 rounded-2xl p-5 border border-white/40">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-gray-800 text-lg">{c.subject}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.status === 'open' ? 'bg-red-100 text-red-700' : c.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {c.status === 'open' ? '🔴 مفتوحة' : c.status === 'in_progress' ? '🟡 قيد المعالجة' : '🟢 تم حلها'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{c.description}</p>
                {c.response && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-xs font-bold text-green-700 mb-1">رد العيادة:</p>
                    <p className="text-sm text-green-800">{c.response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Profile Tab
function ProfileTab({ patient, clinic, setPatient }) {
  const [form, setForm] = useState({
    name: patient.name || '', phone: patient.phone || '', blood_type: patient.blood_type || '',
    allergies: patient.allergies || '', medical_notes: patient.medical_notes || '',
  })
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')

  const saveProfile = async (e) => {
    e.preventDefault(); setLoading(true)
    const { data, error } = await supabase.from('patients').update(form).eq('id', patient.id).select().single()
    setLoading(false)
    if (!error) {
      const updated = { ...data, clinics: clinic }
      setPatient(updated); localStorage.setItem(`patient_session_${clinic.id}`, JSON.stringify(updated))
      setSavedMsg('✅ تم الحفظ بنجاح'); setTimeout(() => setSavedMsg(''), 3000)
    }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    if (passwordForm.current !== patient.password) { alert('❌ كلمة المرور الحالية غير صحيحة'); return }
    if (passwordForm.new !== passwordForm.confirm) { alert('❌ كلمتا المرور غير متطابقتين'); return }
    if (passwordForm.new.length < 4) { alert('❌ كلمة المرور يجب 4 أحرف على الأقل'); return }
    setLoading(true)
    const { data, error } = await supabase.from('patients').update({ password: passwordForm.new }).eq('id', patient.id).select().single()
    setLoading(false)
    if (!error) {
      const updated = { ...data, clinics: clinic }
      setPatient(updated); localStorage.setItem(`patient_session_${clinic.id}`, JSON.stringify(updated))
      setPasswordForm({ current: '', new: '', confirm: '' }); alert('✅ تم تغيير كلمة المرور بنجاح')
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6 shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-600" /> بياناتي الشخصية
        </h3>
        <form onSubmit={saveProfile} className="space-y-4">
          <Field label="الاسم" icon={<User className="w-5 h-5" />}>
            <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
              className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-indigo-500 input-glow outline-none transition font-medium" />
          </Field>
          <Field label="رقم الجوال" icon={<Phone className="w-5 h-5" />}>
            <input type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
              className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-indigo-500 input-glow outline-none transition font-medium" />
          </Field>
          <Field label="فصيلة الدم" icon={<Heart className="w-5 h-5" />}>
            <select value={form.blood_type} onChange={(e) => setForm({...form, blood_type: e.target.value})}
              className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-indigo-500 input-glow outline-none transition font-medium">
              <option value="">غير محدد</option>
              <option value="A+">A+</option><option value="A-">A-</option>
              <option value="B+">B+</option><option value="B-">B-</option>
              <option value="AB+">AB+</option><option value="AB-">AB-</option>
              <option value="O+">O+</option><option value="O-">O-</option>
            </select>
          </Field>
          <Field label="الحساسيات" icon={<AlertCircle className="w-5 h-5" />}>
            <input type="text" value={form.allergies} onChange={(e) => setForm({...form, allergies: e.target.value})}
              className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-indigo-500 input-glow outline-none transition font-medium" />
          </Field>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ملاحظات طبية</label>
            <textarea value={form.medical_notes} onChange={(e) => setForm({...form, medical_notes: e.target.value})} rows="3"
              className="w-full px-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-indigo-500 input-glow outline-none transition font-medium resize-none" />
          </div>
          {savedMsg && <div className="bg-green-50 border-2 border-green-200 text-green-700 p-4 rounded-2xl font-bold animate-fade-in">{savedMsg}</div>}
          <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl btn-glow disabled:opacity-50 shadow-xl">
            {loading ? '⏳ جاري الحفظ...' : '💾 حفظ التعديلات'}
          </button>
        </form>
      </div>

      <div className="glass rounded-3xl p-6 shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Lock className="w-6 h-6 text-pink-600" /> تغيير كلمة المرور
        </h3>
        <form onSubmit={changePassword} className="space-y-4">
          <Field label="كلمة المرور الحالية" icon={<Lock className="w-5 h-5" />}>
            <input type="password" value={passwordForm.current} onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})} required
              className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-pink-500 input-glow outline-none transition font-medium" />
          </Field>
          <Field label="كلمة المرور الجديدة" icon={<Lock className="w-5 h-5" />}>
            <input type="password" value={passwordForm.new} onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})} required
              className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-pink-500 input-glow outline-none transition font-medium" />
          </Field>
          <Field label="تأكيد كلمة المرور" icon={<Lock className="w-5 h-5" />}>
            <input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})} required
              className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-pink-500 input-glow outline-none transition font-medium" />
          </Field>
          <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-2xl btn-glow disabled:opacity-50 shadow-xl">
            🔒 تغيير كلمة المرور
          </button>
        </form>
      </div>
    </div>
  )
}

function EmptyState({ icon, message }) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-3 animate-float">{icon}</div>
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  )
}
