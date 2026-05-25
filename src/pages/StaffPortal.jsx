import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  User, Lock, LogOut, Users, Calendar, AlertCircle, Plus,
  Search, Edit, Trash2, CheckCircle, XCircle, Stethoscope,
  Settings, Phone, CreditCard, Activity, Clock, ShieldCheck,
  Eye, EyeOff, Sparkles
} from 'lucide-react'

export default function StaffPortal() {
  const [view, setView] = useState('login') // login | admin | doctor
  const [user, setUser] = useState(null)
  const [clinic, setClinic] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('staff_session')
    if (saved) {
      try {
        const session = JSON.parse(saved)
        setUser(session.user)
        setClinic(session.clinic)
        setView(session.view)
      } catch (e) {}
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('staff_session')
    setUser(null)
    setClinic(null)
    setView('login')
  }

  const handleLoginSuccess = (user, clinic, viewType) => {
    localStorage.setItem('staff_session', JSON.stringify({ user, clinic, view: viewType }))
    setUser(user)
    setClinic(clinic)
    setView(viewType)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {view === 'login' && (
        <>
          <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 -z-10"></div>
          <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
            <div className="floating-shape w-96 h-96 bg-purple-500 top-10 -right-20"></div>
            <div className="floating-shape w-80 h-80 bg-indigo-500 bottom-20 -left-20" style={{animationDelay: '2s'}}></div>
          </div>
          <StaffLogin onSuccess={handleLoginSuccess} />
        </>
      )}
      {view === 'admin' && <AdminDashboard user={user} clinic={clinic} onLogout={handleLogout} />}
      {view === 'doctor' && <DoctorDashboard user={user} clinic={clinic} onLogout={handleLogout} />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// 🔐 تسجيل دخول الموظفين
// ═══════════════════════════════════════════════════════════
function StaffLogin({ onSuccess }) {
  const [userType, setUserType] = useState('admin')
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

    const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (userType === 'admin') {
        const { data, error: err } = await supabase
          .from('admin_users')
          .select('*, clinics(*)')
          .eq('username', credentials.username.trim())
          .eq('password', credentials.password)
          .in('role', ['clinic_admin', 'super_admin'])
          .limit(1)

        if (err) { console.error(err); setError('❌ خطأ في الاتصال'); setLoading(false); return }

        if (data && data.length > 0) {
          onSuccess(data[0], data[0].clinics, 'admin')
        } else {
          setError('❌ بيانات الدخول غير صحيحة')
        }
      } else {
        const { data, error: err } = await supabase
          .from('doctors')
          .select('*, clinics(*)')
          .eq('username', credentials.username.trim())
          .eq('password', credentials.password)
          .limit(1)

        if (err) { console.error(err); setError('❌ خطأ في الاتصال'); setLoading(false); return }

        if (data && data.length > 0) {
          onSuccess(data[0], data[0].clinics, 'doctor')
        } else {
          setError('❌ بيانات الدخول غير صحيحة')
        }
      }
    } catch (err) {
      console.error(err)
      setError('❌ حصل خطأ، حاول مرة أخرى')
    } finally {
      setLoading(false)
    }
  }
      return (
    <div className="min-h-screen flex items-center justify-center p-4 page-enter">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4 relative">
            <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-2xl"></div>
            <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center">
              <ShieldCheck className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white mb-2">بوابة الموظفين</h1>
          <p className="text-white/70">تسجيل دخول الأدمن والأطباء</p>
        </div>

        {/* Form Card */}
        <div className="glass-dark rounded-3xl p-8 shadow-2xl animate-slide-up">
          {/* User Type Toggle */}
          <div className="grid grid-cols-2 gap-2 mb-6 bg-white/5 p-1.5 rounded-2xl">
            <button
              onClick={() => setUserType('admin')}
              className={`py-3 rounded-xl font-bold transition ${
                userType === 'admin'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              ⚙️ أدمن
            </button>
            <button
              onClick={() => setUserType('doctor')}
              className={`py-3 rounded-xl font-bold transition ${
                userType === 'doctor'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              👨‍⚕️ دكتور
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-white/90 mb-2">اسم المستخدم</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  placeholder={userType === 'admin' ? 'admin' : 'doctor'}
                  required
                  className="w-full pr-12 pl-4 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder-white/40 text-right focus:border-purple-400 outline-none transition font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-white/90 mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  placeholder="••••••"
                  required
                  className="w-full pr-12 pl-12 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder-white/40 text-right focus:border-purple-400 outline-none transition font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border-2 border-red-500/40 text-red-200 p-4 rounded-2xl text-sm font-medium animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 text-white font-bold rounded-2xl btn-glow disabled:opacity-50 shadow-xl text-lg ${
                userType === 'admin'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600'
              }`}
            >
              {loading ? '⏳ جاري الدخول...' : '🚀 دخول'}
            </button>
          </form>

          {/* بيانات تجريبية */}
          <div className="mt-6 pt-6 border-t border-white/10 text-xs text-white/60">
            <p className="font-bold text-white/80 mb-2">🔐 بيانات تجريبية:</p>
            <p>⚙️ أدمن: <code className="bg-white/10 px-2 py-0.5 rounded">admin / admin123</code></p>
            <p>👨‍⚕️ دكتور: <code className="bg-white/10 px-2 py-0.5 rounded">doctor / 123456</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// ⚙️ لوحة الأدمن
// ═══════════════════════════════════════════════════════════
function AdminDashboard({ user, clinic, onLogout }) {
  const [tab, setTab] = useState('dashboard')
  const [stats, setStats] = useState({ patients: 0, doctors: 0, todayAppts: 0, openComplaints: 0 })
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [complaints, setComplaints] = useState([])

  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    const today = new Date().toISOString().split('T')[0]
    const [p, d, a, c] = await Promise.all([
      supabase.from('patients').select('*').eq('clinic_id', clinic.id).order('created_at', { ascending: false }),
      supabase.from('doctors').select('*').eq('clinic_id', clinic.id).order('created_at', { ascending: false }),
      supabase.from('appointments').select('*, patients(*), doctors(*)').eq('clinic_id', clinic.id).order('appointment_date', { ascending: false }),
      supabase.from('complaints').select('*, patients(*)').eq('clinic_id', clinic.id).order('created_at', { ascending: false })
    ])
    setPatients(p.data || [])
    setDoctors(d.data || [])
    setAppointments(a.data || [])
    setComplaints(c.data || [])
    setStats({
      patients: p.data?.length || 0,
      doctors: d.data?.length || 0,
      todayAppts: a.data?.filter(x => x.appointment_date === today).length || 0,
      openComplaints: c.data?.filter(x => x.status === 'open').length || 0
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 page-enter" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-black text-xl">{clinic?.name}</h1>
                <p className="text-white/80 text-xs">⚙️ لوحة الإدارة • {user.full_name || user.username}</p>
              </div>
            </div>
            <button onClick={onLogout} className="bg-white/20 hover:bg-red-500/40 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition backdrop-blur-sm">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-bold">خروج</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-5 overflow-x-auto pb-1">
            {[
              { id: 'dashboard', label: 'الرئيسية', icon: '📊' },
              { id: 'patients', label: 'المرضى', icon: '👥' },
              { id: 'doctors', label: 'الأطباء', icon: '👨‍⚕️' },
              { id: 'appointments', label: 'المواعيد', icon: '📅' },
              { id: 'complaints', label: 'الشكاوى', icon: '⚠️' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition ${
                  tab === t.id ? 'bg-white text-indigo-600 shadow-lg' : 'text-white/80 hover:bg-white/10'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {tab === 'dashboard' && <DashTab stats={stats} appointments={appointments} setTab={setTab} />}
        {tab === 'patients' && <PatientsTab patients={patients} clinic={clinic} onUpdate={loadAll} />}
        {tab === 'doctors' && <DoctorsTab doctors={doctors} clinic={clinic} onUpdate={loadAll} />}
        {tab === 'appointments' && <AppointmentsManageTab appointments={appointments} onUpdate={loadAll} />}
        {tab === 'complaints' && <ComplaintsManageTab complaints={complaints} onUpdate={loadAll} />}
      </div>
    </div>
  )
}

// ─── Dashboard Tab ──────────────────────
function DashTab({ stats, appointments, setTab }) {
  const today = new Date().toISOString().split('T')[0]
  const todayAppts = appointments.filter(a => a.appointment_date === today)

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black text-gray-800">نظرة عامة 📊</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <BigStat icon="👥" label="إجمالي المرضى" value={stats.patients} gradient="from-blue-500 to-cyan-600" onClick={() => setTab('patients')} />
        <BigStat icon="👨‍⚕️" label="الأطباء" value={stats.doctors} gradient="from-green-500 to-emerald-600" onClick={() => setTab('doctors')} />
        <BigStat icon="📅" label="مواعيد اليوم" value={stats.todayAppts} gradient="from-purple-500 to-pink-600" onClick={() => setTab('appointments')} />
        <BigStat icon="⚠️" label="شكاوى مفتوحة" value={stats.openComplaints} gradient="from-orange-500 to-red-600" onClick={() => setTab('complaints')} />
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-indigo-600" />
          مواعيد اليوم
        </h3>
        {todayAppts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-2">📭</div>
            <p>لا توجد مواعيد اليوم</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayAppts.map(apt => <AdminApptCard key={apt.id} apt={apt} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function BigStat({ icon, label, value, gradient, onClick }) {
  return (
    <button onClick={onClick} className={`bg-gradient-to-br ${gradient} text-white rounded-3xl p-6 text-right shadow-xl card-hover`}>
      <div className="text-4xl mb-2">{icon}</div>
      <p className="text-4xl font-black">{value}</p>
      <p className="text-white/80 text-sm font-medium mt-1">{label}</p>
    </button>
  )
}

function AdminApptCard({ apt }) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
  }
  return (
    <div className="border-2 border-gray-100 rounded-2xl p-4 hover:border-indigo-200 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold text-gray-800">{apt.patients?.name}</p>
          <p className="text-sm text-gray-600">📞 {apt.patients?.phone}</p>
          <p className="text-sm text-gray-500 mt-1">👨‍⚕️ {apt.doctors?.name}</p>
        </div>
        <div className="text-left">
          <p className="font-bold text-indigo-600">⏰ {apt.appointment_time}</p>
          <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${colors[apt.status]}`}>
            {apt.status === 'pending' ? '⏳ قيد التأكيد' : apt.status === 'confirmed' ? '✅ مؤكد' : apt.status === 'completed' ? '✔️ مكتمل' : '❌ ملغي'}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Patients Tab ──────────────────────
function PatientsTab({ patients, clinic, onUpdate }) {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', national_id: '', gender: 'male', password: '123456' })

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search) ||
    p.national_id?.includes(search)
  )

  const addPatient = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('patients').insert([{ ...form, clinic_id: clinic.id }])
    if (error) { alert('❌ ' + error.message); return }
    setForm({ name: '', phone: '', national_id: '', gender: 'male', password: '123456' })
    setShowForm(false)
    onUpdate()
  }

  const deletePatient = async (id) => {
    if (!confirm('هل تريد حذف هذا المريض؟')) return
    await supabase.from('patients').delete().eq('id', id)
    onUpdate()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <h2 className="text-3xl font-black text-gray-800">👥 إدارة المرضى</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-2xl font-bold shadow-xl btn-glow flex items-center gap-2">
          <Plus className="w-5 h-5" /> {showForm ? 'إلغاء' : 'مريض جديد'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-3xl p-6 shadow-xl animate-slide-up">
          <form onSubmit={addPatient} className="grid md:grid-cols-2 gap-4">
            <input required placeholder="الاسم *" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none" />
            <input required placeholder="رقم الجوال *" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none" />
            <input placeholder="رقم الهوية" value={form.national_id} onChange={(e) => setForm({...form, national_id: e.target.value})}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none" />
            <select value={form.gender} onChange={(e) => setForm({...form, gender: e.target.value})}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none">
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
            <input placeholder="كلمة المرور (افتراضي: 123456)" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none md:col-span-2" />
            <button type="submit" className="md:col-span-2 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg">
              ✅ حفظ المريض
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 shadow-xl">
        <div className="relative mb-4">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            placeholder="🔍 بحث بالاسم أو الجوال أو رقم الهوية..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 outline-none"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-2">🔍</div>
            <p>{patients.length === 0 ? 'لا يوجد مرضى مسجلين' : 'لا توجد نتائج'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(p => (
              <div key={p.id} className="border-2 border-gray-100 rounded-2xl p-4 hover:border-indigo-200 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {p.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{p.name}</p>
                      <p className="text-sm text-gray-600">📞 {p.phone}</p>
                      {p.national_id && <p className="text-xs text-gray-500">🆔 {p.national_id}</p>}
                    </div>
                  </div>
                  <button onClick={() => deletePatient(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Doctors Tab ──────────────────────
function DoctorsTab({ doctors, clinic, onUpdate }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', specialization: '', phone: '', username: '', password: '123456' })

  const add = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('doctors').insert([{ ...form, clinic_id: clinic.id }])
    if (error) { alert('❌ ' + error.message); return }
    setForm({ name: '', specialization: '', phone: '', username: '', password: '123456' })
    setShowForm(false)
    onUpdate()
  }

  const del = async (id) => {
    if (!confirm('هل تريد حذف الطبيب؟')) return
    await supabase.from('doctors').delete().eq('id', id)
    onUpdate()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <h2 className="text-3xl font-black text-gray-800">👨‍⚕️ إدارة الأطباء</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3 rounded-2xl font-bold shadow-xl btn-glow flex items-center gap-2">
          <Plus className="w-5 h-5" /> {showForm ? 'إلغاء' : 'طبيب جديد'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-3xl p-6 shadow-xl animate-slide-up">
          <form onSubmit={add} className="grid md:grid-cols-2 gap-4">
            <input required placeholder="اسم الطبيب *" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none" />
            <input placeholder="التخصص" value={form.specialization} onChange={(e) => setForm({...form, specialization: e.target.value})}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none" />
            <input placeholder="رقم الجوال" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none" />
            <input required placeholder="اسم المستخدم (للدخول) *" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none" />
            <input placeholder="كلمة المرور" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none md:col-span-2" />
            <button type="submit" className="md:col-span-2 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg">
              ✅ حفظ الطبيب
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {doctors.length === 0 ? (
          <div className="md:col-span-2 bg-white rounded-3xl p-12 text-center text-gray-500 shadow-xl">
            <div className="text-5xl mb-2">👨‍⚕️</div>
            <p>لا يوجد أطباء مسجلين</p>
          </div>
        ) : doctors.map(d => (
          <div key={d.id} className="bg-white rounded-2xl p-5 shadow-lg card-hover">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-3xl">
                  👨‍⚕️
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-lg">{d.name}</p>
                  <p className="text-sm text-gray-600">{d.specialization}</p>
                  <p className="text-xs text-gray-500 mt-1">📞 {d.phone}</p>
                </div>
              </div>
              <button onClick={() => del(d.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Appointments Manage Tab ──────────────────────
function AppointmentsManageTab({ appointments, onUpdate }) {
  const updateStatus = async (id, status) => {
    await supabase.from('appointments').update({ status }).eq('id', id)
    onUpdate()
  }
  const del = async (id) => {
    if (!confirm('حذف الموعد؟')) return
    await supabase.from('appointments').delete().eq('id', id)
    onUpdate()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black text-gray-800">📅 المواعيد</h2>
      <div className="bg-white rounded-3xl p-6 shadow-xl">
        {appointments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-2">📅</div>
            <p>لا توجد مواعيد</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map(apt => (
              <div key={apt.id} className="border-2 border-gray-100 rounded-2xl p-4 hover:border-indigo-200 hover:shadow-md transition">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{apt.patients?.name}</p>
                    <p className="text-sm text-gray-600">📞 {apt.patients?.phone}</p>
                    <p className="text-sm text-gray-500 mt-1">👨‍⚕️ {apt.doctors?.name}</p>
                    <p className="text-sm text-indigo-600 font-bold mt-2">📅 {apt.appointment_date} ⏰ {apt.appointment_time}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <select
                      value={apt.status}
                      onChange={(e) => updateStatus(apt.id, e.target.value)}
                      className="px-3 py-2 border-2 border-gray-200 rounded-xl text-sm font-bold focus:border-indigo-500 outline-none"
                    >
                      <option value="pending">⏳ قيد التأكيد</option>
                      <option value="confirmed">✅ مؤكد</option>
                      <option value="completed">✔️ مكتمل</option>
                      <option value="cancelled">❌ ملغي</option>
                    </select>
                    <button onClick={() => del(apt.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg flex items-center gap-1 text-sm justify-center">
                      <Trash2 className="w-4 h-4" /> حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Complaints Manage Tab ──────────────────────
function ComplaintsManageTab({ complaints, onUpdate }) {
  const [editingId, setEditingId] = useState(null)
  const [response, setResponse] = useState('')

  const respond = async (id, status) => {
    await supabase.from('complaints').update({
      response: response,
      status: status,
      resolved_at: status === 'resolved' ? new Date().toISOString() : null
    }).eq('id', id)
    setEditingId(null)
    setResponse('')
    onUpdate()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black text-gray-800">⚠️ الشكاوى</h2>
      <div className="bg-white rounded-3xl p-6 shadow-xl">
        {complaints.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-2">✨</div>
            <p>لا توجد شكاوى</p>
          </div>
        ) : (
          <div className="space-y-3">
            {complaints.map(c => (
              <div key={c.id} className="border-2 border-gray-100 rounded-2xl p-5 hover:border-indigo-200 transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-800">{c.subject}</p>
                    <p className="text-sm text-gray-500">👤 {c.patients?.name} • 📞 {c.patients?.phone}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    c.status === 'open' ? 'bg-red-100 text-red-700' :
                    c.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {c.status === 'open' ? '🔴 مفتوحة' : c.status === 'in_progress' ? '🟡 قيد المعالجة' : '🟢 تم حلها'}
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{c.description}</p>

                {c.response && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3">
                    <p className="text-xs font-bold text-green-700 mb-1">الرد:</p>
                    <p className="text-sm text-green-800">{c.response}</p>
                  </div>
                )}

                {editingId === c.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="اكتب الرد..."
                      rows="3"
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none"
                    />
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => respond(c.id, 'in_progress')} className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold text-sm">🟡 قيد المعالجة</button>
                      <button onClick={() => respond(c.id, 'resolved')} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm">✅ تم الحل</button>
                      <button onClick={() => setEditingId(null)} className="bg-gray-200 px-4 py-2 rounded-lg text-sm">إلغاء</button>
                    </div>
                  </div>
                ) : (
                  c.status !== 'resolved' && (
                    <button onClick={() => { setEditingId(c.id); setResponse(c.response || '') }}
                      className="text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg font-bold text-sm">
                      💬 الرد على الشكوى
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// 👨‍⚕️ لوحة الدكتور
// ═══════════════════════════════════════════════════════════
function DoctorDashboard({ user, clinic, onLogout }) {
  const [appointments, setAppointments] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('appointments')
      .select('*, patients(*)')
      .eq('doctor_id', user.id)
      .order('appointment_date', { ascending: false })
      .order('appointment_time')
    setAppointments(data || [])
    setLoading(false)
  }

  const filtered = appointments.filter(apt => {
    const matchSearch = !search ||
      apt.patients?.name?.toLowerCase().includes(search.toLowerCase()) ||
      apt.patients?.phone?.includes(search) ||
      apt.patients?.national_id?.includes(search)
    const matchFilter = filter === 'all' || apt.type === filter
    return matchSearch && matchFilter
  })

  const firstVisits = appointments.filter(a => a.type === 'first_visit')
  const emergencies = appointments.filter(a => a.type === 'emergency')
  const followUps = appointments.filter(a => a.type === 'follow_up')

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 page-enter" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 shadow-2xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm text-2xl">
                👨‍⚕️
              </div>
              <div>
                <h1 className="text-white font-black text-xl">{user.name}</h1>
                <p className="text-white/80 text-xs">{user.specialization} • {clinic?.name}</p>
              </div>
            </div>
            <button onClick={onLogout} className="bg-white/20 hover:bg-red-500/40 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition backdrop-blur-sm">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-bold">خروج</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <BigStat icon="🆕" label="كشف أول" value={firstVisits.length} gradient="from-red-500 to-pink-600" onClick={() => setFilter('first_visit')} />
          <BigStat icon="🚨" label="طوارئ" value={emergencies.length} gradient="from-orange-500 to-red-600" onClick={() => setFilter('emergency')} />
          <BigStat icon="🔄" label="متابعات" value={followUps.length} gradient="from-green-500 to-emerald-600" onClick={() => setFilter('follow_up')} />
          <BigStat icon="📋" label="الكل" value={appointments.length} gradient="from-indigo-500 to-purple-600" onClick={() => setFilter('all')} />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                placeholder="🔍 بحث بالاسم أو الجوال أو رقم الهوية..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-green-500 outline-none"
              />
            </div>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-green-500 outline-none font-bold">
              <option value="all">📋 الكل</option>
              <option value="first_visit">🆕 كشف أول</option>
              <option value="emergency">🚨 طوارئ</option>
              <option value="follow_up">🔄 متابعة</option>
              <option value="consultation">💬 استشارة</option>
            </select>
          </div>
        </div>

        {/* Patients List */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📋 قائمة المرضى ({filtered.length})</h3>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-5xl mb-2">📭</div>
              <p>لا يوجد مرضى</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(apt => (
                <div key={apt.id} className={`border-r-4 rounded-2xl p-4 ${
                  apt.type === 'first_visit' ? 'border-red-500 bg-red-50' :
                  apt.type === 'emergency' ? 'border-orange-500 bg-orange-50' :
                  apt.type === 'follow_up' ? 'border-green-500 bg-green-50' :
                  'border-blue-500 bg-blue-50'
                }`}>
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow">
                        {apt.patients?.gender === 'female' ? '👩' : '👨'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-lg">{apt.patients?.name}</p>
                        <p className="text-sm text-gray-600">📞 {apt.patients?.phone}</p>
                        {apt.patients?.national_id && (
                          <p className="text-xs text-gray-500">🆔 {apt.patients.national_id}</p>
                        )}
                        {apt.patients?.medical_notes && (
                          <p className="text-xs text-gray-600 mt-1">📋 {apt.patients.medical_notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-700">📅 {apt.appointment_date}</p>
                      <p className="text-gray-600">⏰ {apt.appointment_time}</p>
                      <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${
                        apt.type === 'first_visit' ? 'bg-red-200 text-red-800' :
                        apt.type === 'emergency' ? 'bg-orange-200 text-orange-800' :
                        apt.type === 'follow_up' ? 'bg-green-200 text-green-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {apt.type === 'first_visit' ? '🆕 كشف أول' :
                         apt.type === 'emergency' ? '🚨 طوارئ' :
                         apt.type === 'follow_up' ? '🔄 متابعة' : '💬 استشارة'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
