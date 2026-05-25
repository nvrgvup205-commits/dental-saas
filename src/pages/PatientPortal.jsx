import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  User, Lock, Phone, CreditCard, Calendar, Heart, AlertCircle,
  LogOut, Plus, CheckCircle, XCircle, Clock, FileText,
  ArrowLeft, ArrowRight, Sparkles, Stethoscope, Activity,
  ShieldCheck, Settings, Eye, EyeOff
} from 'lucide-react'

export default function PatientPortal() {
  const [view, setView] = useState('welcome') // welcome | login | register | dashboard
  const [currentPatient, setCurrentPatient] = useState(null)

  // استرجاع الجلسة من localStorage
  useEffect(() => {
    const saved = localStorage.getItem('patient_session')
    if (saved) {
      try {
        const patient = JSON.parse(saved)
        setCurrentPatient(patient)
        setView('dashboard')
      } catch (e) { /* ignore */ }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('patient_session')
    setCurrentPatient(null)
    setView('welcome')
  }

  const handleLoginSuccess = (patient) => {
    localStorage.setItem('patient_session', JSON.stringify(patient))
    setCurrentPatient(patient)
    setView('dashboard')
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* خلفية متحركة بشكل ساحر */}
      <div className="fixed inset-0 gradient-bg-animated -z-10"></div>
      
      {/* أشكال زخرفية متحركة */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="floating-shape w-96 h-96 bg-purple-300 top-10 -right-20"></div>
        <div className="floating-shape w-80 h-80 bg-pink-300 bottom-20 -left-20" style={{animationDelay: '2s'}}></div>
        <div className="floating-shape w-72 h-72 bg-blue-300 top-1/2 left-1/3" style={{animationDelay: '4s'}}></div>
      </div>

      {view === 'welcome' && <WelcomeScreen onLogin={() => setView('login')} onRegister={() => setView('register')} />}
      {view === 'login' && <LoginScreen onBack={() => setView('welcome')} onSuccess={handleLoginSuccess} onRegister={() => setView('register')} />}
      {view === 'register' && <RegisterScreen onBack={() => setView('welcome')} onSuccess={handleLoginSuccess} onLogin={() => setView('login')} />}
      {view === 'dashboard' && <Dashboard patient={currentPatient} onLogout={handleLogout} setPatient={setCurrentPatient} />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// 🎨 شاشة الترحيب
// ═══════════════════════════════════════════════════════════
function WelcomeScreen({ onLogin, onRegister }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 page-enter">
      <div className="w-full max-w-md">
        {/* Logo + Title */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-block mb-6 relative">
            <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl"></div>
            <div className="relative w-28 h-28 mx-auto bg-white rounded-3xl shadow-2xl flex items-center justify-center text-7xl animate-float">
              🦷
            </div>
          </div>
          <h1 className="text-5xl font-black text-white mb-3 drop-shadow-lg">
            أهلاً بك
          </h1>
          <p className="text-white/90 text-lg font-medium">
            في نظام عيادة الأسنان الذكي
          </p>
          <div className="flex items-center justify-center gap-2 mt-3 text-white/80 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>تجربة سلسة وآمنة</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4 animate-slide-up">
          <button
            onClick={onLogin}
            className="w-full glass rounded-2xl p-6 text-right card-hover btn-glow group"
          >
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

          <button
            onClick={onRegister}
            className="w-full glass rounded-2xl p-6 text-right card-hover btn-glow group"
          >
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

        {/* Footer */}
        <div className="text-center mt-8 text-white/70 text-sm">
          <p>🔒 بياناتك محمية ومشفّرة</p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// 🔐 شاشة تسجيل الدخول
// ═══════════════════════════════════════════════════════════
function LoginScreen({ onBack, onSuccess, onRegister }) {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: dbError } = await supabase
        .from('patients')
        .select('*, clinics(*)')
        .eq('phone', phone.trim())
        .eq('password', password)
        .maybeSingle()

      if (dbError) throw dbError

      if (!data) {
        setError('❌ رقم الجوال أو كلمة المرور غير صحيحة')
        setLoading(false)
        return
      }

      onSuccess(data)
    } catch (err) {
      setError('❌ حصل خطأ، حاول مرة أخرى')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 page-enter">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="text-white/90 hover:text-white flex items-center gap-2 mb-6 transition group"
        >
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          <span>رجوع</span>
        </button>

        <div className="glass rounded-3xl p-8 shadow-2xl animate-slide-up">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl mb-4">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">تسجيل الدخول</h2>
            <p className="text-gray-600">أدخل بياناتك للمتابعة</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* رقم الجوال */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">رقم الجوال</label>
              <div className="relative">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05xxxxxxxx"
                  required
                  disabled={loading}
                  className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-indigo-500 input-glow outline-none transition font-medium"
                />
              </div>
            </div>

            {/* كلمة المرور */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  required
                  disabled={loading}
                  className="w-full pr-12 pl-12 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-indigo-500 input-glow outline-none transition font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* رسالة الخطأ */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-2xl text-sm font-medium animate-fade-in">
                {error}
              </div>
            )}

            {/* زر الدخول */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl btn-glow disabled:opacity-50 disabled:cursor-not-allowed shadow-xl text-lg"
            >
              {loading ? '⏳ جاري الدخول...' : '🚀 دخول'}
            </button>
          </form>

          {/* رابط التسجيل */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              لسه ما عندكش حساب؟{' '}
              <button onClick={onRegister} className="text-indigo-600 font-bold hover:underline">
                سجّل الآن
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// ✍️ شاشة التسجيل الجديد
// ═══════════════════════════════════════════════════════════
function RegisterScreen({ onBack, onSuccess, onLogin }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    national_id: '',
    date_of_birth: '',
    gender: 'male',
    blood_type: '',
    allergies: '',
    medical_notes: '',
    password: '',
    password_confirm: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1) // 1: بيانات أساسية | 2: بيانات طبية

  const update = (field, value) => setForm({ ...form, [field]: value })

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    // التحقق من تطابق كلمة المرور
    if (form.password !== form.password_confirm) {
      setError('❌ كلمة المرور وتأكيدها غير متطابقين')
      return
    }
    if (form.password.length < 4) {
      setError('❌ كلمة المرور يجب أن تكون 4 أحرف على الأقل')
      return
    }

    setLoading(true)

    try {
      // 1) التحقق من تكرار رقم الجوال
      const { data: existPhone } = await supabase
        .from('patients')
        .select('id')
        .eq('phone', form.phone.trim())
        .maybeSingle()

      if (existPhone) {
        setError('❌ هذا الرقم مسجل بالفعل، الرجاء تسجيل الدخول')
        setLoading(false)
        return
      }

      // 2) التحقق من تكرار رقم الهوية (لو موجود)
      if (form.national_id.trim()) {
        const { data: existId } = await supabase
          .from('patients')
          .select('id')
          .eq('national_id', form.national_id.trim())
          .maybeSingle()

        if (existId) {
          setError('❌ رقم الهوية مسجل بالفعل')
          setLoading(false)
          return
        }
      }

      // 3) جلب العيادة الأولى (يمكن تعديلها لاحقاً للـ multi-tenant)
      const { data: clinic } = await supabase
        .from('clinics')
        .select('id')
        .limit(1)
        .single()

      // 4) إدخال البيانات
      const { data, error: insertError } = await supabase
        .from('patients')
        .insert([{
          clinic_id: clinic?.id || null,
          name: form.name.trim(),
          phone: form.phone.trim(),
          national_id: form.national_id.trim() || null,
          date_of_birth: form.date_of_birth || null,
          gender: form.gender,
          blood_type: form.blood_type || null,
          allergies: form.allergies || null,
          medical_notes: form.medical_notes || null,
          password: form.password
        }])
        .select('*, clinics(*)')
        .single()

      if (insertError) throw insertError

      onSuccess(data)
    } catch (err) {
      console.error(err)
      setError('❌ حصل خطأ أثناء التسجيل: ' + (err.message || ''))
    } finally {
      setLoading(false)
    }
  }

  const goToStep2 = (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.phone || !form.password) {
      setError('❌ الرجاء ملء كل الحقول الإلزامية')
      return
    }
    setStep(2)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8 page-enter">
      <div className="w-full max-w-lg">
        <button
          onClick={step === 2 ? () => setStep(1) : onBack}
          className="text-white/90 hover:text-white flex items-center gap-2 mb-4 transition group"
        >
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          <span>رجوع</span>
        </button>

        <div className="glass rounded-3xl p-8 shadow-2xl animate-slide-up">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl flex items-center justify-center shadow-xl mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">تسجيل مريض جديد</h2>
            <p className="text-gray-600">خطوة {step} من 2</p>

            {/* Progress bar */}
            <div className="flex gap-2 mt-4 max-w-xs mx-auto">
              <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-gradient-to-r from-pink-500 to-rose-600' : 'bg-gray-200'}`}></div>
              <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-gradient-to-r from-pink-500 to-rose-600' : 'bg-gray-200'}`}></div>
            </div>
          </div>

          {/* Step 1: بيانات أساسية */}
          {step === 1 && (
            <form onSubmit={goToStep2} className="space-y-4">
              <Field label="الاسم الكامل *" icon={<User className="w-5 h-5" />}>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="مثال: محمد أحمد"
                  required
                  className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-pink-500 input-glow outline-none transition font-medium"
                />
              </Field>

              <Field label="رقم الجوال *" icon={<Phone className="w-5 h-5" />}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="05xxxxxxxx"
                  required
                  className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-pink-500 input-glow outline-none transition font-medium"
                />
              </Field>

              <Field label="رقم الهوية / الإقامة" icon={<IdCard className="w-5 h-5" />}>
                <input
                  type="text"
                  value={form.national_id}
                  onChange={(e) => update('national_id', e.target.value)}
                  placeholder="اختياري"
                  className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-pink-500 input-glow outline-none transition font-medium"
                />
              </Field>

              <Field label="كلمة المرور *" icon={<Lock className="w-5 h-5" />}>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="على الأقل 4 أحرف"
                  required
                  className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-pink-500 input-glow outline-none transition font-medium"
                />
              </Field>

              <Field label="تأكيد كلمة المرور *" icon={<Lock className="w-5 h-5" />}>
                <input
                  type="password"
                  value={form.password_confirm}
                  onChange={(e) => update('password_confirm', e.target.value)}
                  placeholder="أعد كتابة كلمة المرور"
                  required
                  className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-pink-500 input-glow outline-none transition font-medium"
                />
              </Field>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-2xl text-sm font-medium animate-fade-in">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-2xl btn-glow shadow-xl text-lg"
              >
                التالي ←
              </button>
            </form>
          )}

          {/* Step 2: بيانات طبية */}
          {step === 2 && (
            <form onSubmit={handleRegister} className="space-y-4">
              <Field label="تاريخ الميلاد" icon={<Calendar className="w-5 h-5" />}>
                <input
                  type="date"
                  value={form.date_of_birth}
                  onChange={(e) => update('date_of_birth', e.target.value)}
                  className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-pink-500 input-glow outline-none transition font-medium"
                />
              </Field>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الجنس</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => update('gender', 'male')}
                    className={`py-4 rounded-2xl font-bold transition ${
                      form.gender === 'male'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl scale-105'
                        : 'bg-white/80 text-gray-700 border-2 border-gray-200'
                    }`}
                  >
                    👨 ذكر
                  </button>
                  <button
                    type="button"
                    onClick={() => update('gender', 'female')}
                    className={`py-4 rounded-2xl font-bold transition ${
                      form.gender === 'female'
                        ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-xl scale-105'
                        : 'bg-white/80 text-gray-700 border-2 border-gray-200'
                    }`}
                  >
                    👩 أنثى
                  </button>
                </div>
              </div>

              <Field label="فصيلة الدم" icon={<Heart className="w-5 h-5" />}>
                <select
                  value={form.blood_type}
                  onChange={(e) => update('blood_type', e.target.value)}
                  className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-pink-500 input-glow outline-none transition font-medium"
                >
                  <option value="">اختياري</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </Field>

              <Field label="الحساسيات" icon={<AlertCircle className="w-5 h-5" />}>
                <input
                  type="text"
                  value={form.allergies}
                  onChange={(e) => update('allergies', e.target.value)}
                  placeholder="مثال: البنسلين، الفول السوداني..."
                  className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-pink-500 input-glow outline-none transition font-medium"
                />
              </Field>

              <Field label="ملاحظات طبية" icon={<FileText className="w-5 h-5" />}>
                <textarea
                  value={form.medical_notes}
                  onChange={(e) => update('medical_notes', e.target.value)}
                  placeholder="أمراض مزمنة، أدوية، أي ملاحظات مهمة..."
                  rows="3"
                  className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-pink-500 input-glow outline-none transition font-medium resize-none"
                />
              </Field>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-2xl text-sm font-medium animate-fade-in">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl btn-glow disabled:opacity-50 shadow-xl text-lg"
              >
                {loading ? '⏳ جاري التسجيل...' : '✅ إنشاء الحساب'}
              </button>
            </form>
          )}

          {/* رابط تسجيل الدخول */}
          {step === 1 && (
            <div className="text-center mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                عندك حساب بالفعل؟{' '}
                <button onClick={onLogin} className="text-pink-600 font-bold hover:underline">
                  سجّل دخول
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Field helper
function Field({ label, icon, children }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
          {icon}
        </div>
        {children}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// 🏠 لوحة المريض الرئيسية
// ═══════════════════════════════════════════════════════════
function Dashboard({ patient, onLogout, setPatient }) {
  const [appointments, setAppointments] = useState([])
  const [complaints, setComplaints] = useState([])
  const [activeTab, setActiveTab] = useState('home')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [apptsRes, complsRes] = await Promise.all([
      supabase
        .from('appointments')
        .select('*, doctors(*)')
        .eq('patient_id', patient.id)
        .order('appointment_date', { ascending: false }),
      supabase
        .from('complaints')
        .select('*')
        .eq('patient_id', patient.id)
        .order('created_at', { ascending: false })
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

  return (
    <div className="min-h-screen page-enter">
      {/* Header */}
      <div className="glass-dark sticky top-0 z-40 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              🦷
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">{patient.name}</h1>
              <p className="text-white/70 text-xs">{patient.clinics?.name || 'عيادة الأسنان'}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="bg-white/10 hover:bg-red-500/30 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">خروج</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto">
          {[
            { id: 'home', label: 'الرئيسية', icon: '🏠' },
            { id: 'appointments', label: 'مواعيدي', icon: '📅' },
            { id: 'book', label: 'حجز موعد', icon: '➕' },
            { id: 'complaints', label: 'شكاوي', icon: '⚠️' },
            { id: 'profile', label: 'بياناتي', icon: '⚙️' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* المحتوى */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {loading ? (
          <div className="text-center py-20 text-white">
            <div className="inline-block w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            <p className="mt-4 font-medium">جاري التحميل...</p>
          </div>
        ) : (
          <>
            {activeTab === 'home' && <HomeTab patient={patient} upcoming={upcoming} complaints={complaints} setActiveTab={setActiveTab} />}
            {activeTab === 'appointments' && <AppointmentsTab upcoming={upcoming} past={past} onCancel={cancelAppointment} />}
            {activeTab === 'book' && <BookAppointmentTab patient={patient} onSuccess={() => { loadData(); setActiveTab('appointments'); }} />}
            {activeTab === 'complaints' && <ComplaintsTab patient={patient} complaints={complaints} onUpdate={loadData} />}
            {activeTab === 'profile' && <ProfileTab patient={patient} setPatient={setPatient} />}
          </>
        )}
      </div>
    </div>
  )
}

// ─── Home Tab ────────────────────────────────────────────────
function HomeTab({ patient, upcoming, complaints, setActiveTab }) {
  return (
    <div className="space-y-6">
      {/* بطاقة الترحيب */}
      <div className="glass rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="text-6xl animate-float">👋</div>
          <div>
            <h2 className="text-3xl font-black text-gray-800">أهلاً {patient.name.split(' ')[0]}!</h2>
            <p className="text-gray-600 mt-1">سعداء برؤيتك معنا اليوم</p>
          </div>
        </div>
      </div>

      {/* إحصائيات */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard icon="📅" label="مواعيد قادمة" value={upcoming.length} gradient="from-blue-500 to-indigo-600" />
        <StatCard icon="✅" label="مواعيد مكتملة" value={0} gradient="from-green-500 to-emerald-600" />
        <StatCard icon="⚠️" label="شكاوى مفتوحة" value={complaints.filter(c => c.status === 'open').length} gradient="from-orange-500 to-red-600" />
      </div>

      {/* أزرار سريعة */}
      <div className="grid md:grid-cols-2 gap-4">
        <button
          onClick={() => setActiveTab('book')}
          className="glass rounded-2xl p-6 text-right card-hover group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800">حجز موعد جديد 📅</h3>
              <p className="text-gray-600 text-sm mt-1">احجز الآن بكل سهولة</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition">
              <Plus className="w-7 h-7" />
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className="glass rounded-2xl p-6 text-right card-hover group"
        >
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

      {/* المواعيد القادمة */}
      {upcoming.length > 0 && (
        <div className="glass rounded-3xl p-6 shadow-2xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600" />
            موعدك القادم
          </h3>
          <AppointmentCard apt={upcoming[0]} />
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, gradient }) {
  return (
    <div className="glass rounded-2xl p-6 card-hover">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg mb-3`}>
        {icon}
      </div>
      <p className="text-3xl font-black text-gray-800">{value}</p>
      <p className="text-gray-600 text-sm font-medium mt-1">{label}</p>
    </div>
  )
}

function AppointmentCard({ apt, onCancel }) {
  const statusColors = {
    pending: 'from-yellow-400 to-orange-500',
    confirmed: 'from-green-400 to-emerald-500',
    completed: 'from-gray-400 to-gray-500',
    cancelled: 'from-red-400 to-red-500',
  }
  const statusLabels = {
    pending: '⏳ قيد التأكيد',
    confirmed: '✅ مؤكد',
    completed: '✔️ مكتمل',
    cancelled: '❌ ملغي',
  }
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
      {onCancel && apt.status !== 'cancelled' && apt.status !== 'completed' && (
        <button
          onClick={() => onCancel(apt.id)}
          className="mt-2 text-red-600 hover:text-red-800 text-sm font-bold flex items-center gap-1"
        >
          <XCircle className="w-4 h-4" />
          إلغاء الموعد
        </button>
      )}
    </div>
  )
}

// ─── Appointments Tab ────────────────────────────────────────
function AppointmentsTab({ upcoming, past, onCancel }) {
  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6 shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-indigo-600" />
          المواعيد القادمة ({upcoming.length})
        </h3>
        {upcoming.length === 0 ? (
          <EmptyState icon="📅" message="لا توجد مواعيد قادمة" />
        ) : (
          <div className="space-y-3">
            {upcoming.map(apt => <AppointmentCard key={apt.id} apt={apt} onCancel={onCancel} />)}
          </div>
        )}
      </div>

      <div className="glass rounded-3xl p-6 shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6 text-gray-600" />
          سجل المواعيد السابقة ({past.length})
        </h3>
        {past.length === 0 ? (
          <EmptyState icon="📋" message="لا توجد مواعيد سابقة" />
        ) : (
          <div className="space-y-3">
            {past.map(apt => <AppointmentCard key={apt.id} apt={apt} />)}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Book Appointment Tab ────────────────────────────────────
function BookAppointmentTab({ patient, onSuccess }) {
  const [doctors, setDoctors] = useState([])
  const [form, setForm] = useState({
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    type: 'first_visit',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    supabase
      .from('doctors')
      .select('*')
      .eq('clinic_id', patient.clinic_id)
      .eq('is_active', true)
      .then(({ data }) => setDoctors(data || []))
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('appointments').insert([{
      clinic_id: patient.clinic_id,
      patient_id: patient.id,
      doctor_id: form.doctor_id,
      appointment_date: form.appointment_date,
      appointment_time: form.appointment_time,
      type: form.type,
      notes: form.notes,
      status: 'pending'
    }])

    setLoading(false)
    if (!error) {
      setSuccess(true)
      setTimeout(() => onSuccess(), 1500)
    } else {
      alert('❌ حصل خطأ: ' + error.message)
    }
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

  return (
    <div className="glass rounded-3xl p-8 shadow-2xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Plus className="w-6 h-6 text-indigo-600" />
        حجز موعد جديد
      </h3>

      <form onSubmit={submit} className="space-y-5">
        <Field label="اختر الطبيب *" icon={<Stethoscope className="w-5 h-5" />}>
          <select
            value={form.doctor_id}
            onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
            required
            className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-indigo-500 input-glow outline-none transition font-medium"
          >
            <option value="">اختر طبيب</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name} {d.specialization && `- ${d.specialization}`}</option>
            ))}
          </select>
        </Field>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="التاريخ *" icon={<Calendar className="w-5 h-5" />}>
            <input
              type="date"
              value={form.appointment_date}
              onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-indigo-500 input-glow outline-none transition font-medium"
            />
          </Field>

          <Field label="الوقت *" icon={<Clock className="w-5 h-5" />}>
            <input
              type="time"
              value={form.appointment_time}
              onChange={(e) => setForm({ ...form, appointment_time: e.target.value })}
              required
              className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-indigo-500 input-glow outline-none transition font-medium"
            />
          </Field>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">نوع الزيارة</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { val: 'first_visit', label: 'كشف أول', icon: '🆕' },
              { val: 'follow_up', label: 'متابعة', icon: '🔄' },
              { val: 'emergency', label: 'طوارئ', icon: '🚨' },
              { val: 'consultation', label: 'استشارة', icon: '💬' },
            ].map(t => (
              <button
                key={t.val}
                type="button"
                onClick={() => setForm({ ...form, type: t.val })}
                className={`py-3 rounded-2xl font-bold text-sm transition ${
                  form.type === t.val
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white/80 text-gray-700 border-2 border-gray-200'
                }`}
              >
                <div>{t.icon}</div>
                <div>{t.label}</div>
              </button>
            ))}
          </div>
        </div>

        <Field label="ملاحظات (اختياري)" icon={<FileText className="w-5 h-5" />}>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="أي معلومات إضافية..."
            rows="3"
            className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-indigo-500 input-glow outline-none transition font-medium resize-none"
          />
        </Field>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl btn-glow disabled:opacity-50 shadow-xl text-lg"
        >
          {loading ? '⏳ جاري الحجز...' : '🎯 تأكيد الحجز'}
        </button>
      </form>
    </div>
  )
}

// ─── Complaints Tab ──────────────────────────────────────────
function ComplaintsTab({ patient, complaints, onUpdate }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ subject: '', description: '' })
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await supabase.from('complaints').insert([{
      clinic_id: patient.clinic_id,
      patient_id: patient.id,
      subject: form.subject,
      description: form.description,
      status: 'open'
    }])
    setLoading(false)
    setForm({ subject: '', description: '' })
    setShowForm(false)
    onUpdate()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">⚠️ الشكاوى</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-3 rounded-2xl font-bold shadow-xl btn-glow flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {showForm ? 'إلغاء' : 'شكوى جديدة'}
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-3xl p-6 shadow-2xl animate-slide-up">
          <form onSubmit={submit} className="space-y-4">
            <Field label="الموضوع *" icon={<FileText className="w-5 h-5" />}>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="ملخص الشكوى"
                required
                className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-orange-500 input-glow outline-none transition font-medium"
              />
            </Field>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">التفاصيل *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="اشرح المشكلة بالتفصيل..."
                rows="4"
                required
                className="w-full px-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-orange-500 input-glow outline-none transition font-medium resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-2xl btn-glow shadow-xl"
            >
              {loading ? '⏳ جاري الإرسال...' : '📤 إرسال الشكوى'}
            </button>
          </form>
        </div>
      )}

      <div className="glass rounded-3xl p-6 shadow-2xl">
        {complaints.length === 0 ? (
          <EmptyState icon="✨" message="لا توجد شكاوى" />
        ) : (
          <div className="space-y-3">
            {complaints.map(c => (
              <div key={c.id} className="bg-white/60 rounded-2xl p-5 border border-white/40">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-gray-800 text-lg">{c.subject}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    c.status === 'open' ? 'bg-red-100 text-red-700' :
                    c.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {c.status === 'open' ? '🔴 مفتوحة' :
                     c.status === 'in_progress' ? '🟡 قيد المعالجة' :
                     '🟢 تم حلها'}
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

// ─── Profile Tab ─────────────────────────────────────────────
function ProfileTab({ patient, setPatient }) {
  const [form, setForm] = useState({
    name: patient.name || '',
    phone: patient.phone || '',
    blood_type: patient.blood_type || '',
    allergies: patient.allergies || '',
    medical_notes: patient.medical_notes || '',
  })
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')

  const saveProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase
      .from('patients')
      .update(form)
      .eq('id', patient.id)
      .select('*, clinics(*)')
      .single()
    setLoading(false)
    if (!error) {
      setPatient(data)
      localStorage.setItem('patient_session', JSON.stringify(data))
      setSavedMsg('✅ تم الحفظ بنجاح')
      setTimeout(() => setSavedMsg(''), 3000)
    }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    if (passwordForm.current !== patient.password) {
      alert('❌ كلمة المرور الحالية غير صحيحة')
      return
    }
    if (passwordForm.new !== passwordForm.confirm) {
      alert('❌ كلمتا المرور غير متطابقتين')
      return
    }
    if (passwordForm.new.length < 4) {
      alert('❌ كلمة المرور يجب 4 أحرف على الأقل')
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('patients')
      .update({ password: passwordForm.new })
      .eq('id', patient.id)
      .select('*, clinics(*)')
      .single()
    setLoading(false)
    if (!error) {
      setPatient(data)
      localStorage.setItem('patient_session', JSON.stringify(data))
      setPasswordForm({ current: '', new: '', confirm: '' })
      alert('✅ تم تغيير كلمة المرور بنجاح')
    }
  }

  return (
    <div className="space-y-6">
      {/* بطاقة البيانات */}
      <div className="glass rounded-3xl p-6 shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-600" />
          بياناتي الشخصية
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
            <textarea value={form.medical_notes} onChange={(e) => setForm({...form, medical_notes: e.target.value})}
              rows="3"
              className="w-full px-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-indigo-500 input-glow outline-none transition font-medium resize-none" />
          </div>

          {savedMsg && (
            <div className="bg-green-50 border-2 border-green-200 text-green-700 p-4 rounded-2xl font-bold animate-fade-in">
              {savedMsg}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl btn-glow disabled:opacity-50 shadow-xl">
            {loading ? '⏳ جاري الحفظ...' : '💾 حفظ التعديلات'}
          </button>
        </form>
      </div>

      {/* تغيير كلمة المرور */}
      <div className="glass rounded-3xl p-6 shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Lock className="w-6 h-6 text-pink-600" />
          تغيير كلمة المرور
        </h3>

        <form onSubmit={changePassword} className="space-y-4">
          <Field label="كلمة المرور الحالية" icon={<Lock className="w-5 h-5" />}>
            <input type="password" value={passwordForm.current} onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
              required
              className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-pink-500 input-glow outline-none transition font-medium" />
          </Field>

          <Field label="كلمة المرور الجديدة" icon={<Lock className="w-5 h-5" />}>
            <input type="password" value={passwordForm.new} onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
              required
              className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-pink-500 input-glow outline-none transition font-medium" />
          </Field>

          <Field label="تأكيد كلمة المرور" icon={<Lock className="w-5 h-5" />}>
            <input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
              required
              className="w-full pr-12 pl-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl text-gray-800 text-right focus:border-pink-500 input-glow outline-none transition font-medium" />
          </Field>

          <button type="submit" disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-2xl btn-glow disabled:opacity-50 shadow-xl">
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
