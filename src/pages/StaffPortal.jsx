import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  User, Lock, LogOut, Users, Calendar, AlertCircle, Plus,
  Search, Edit, Trash2, CheckCircle, XCircle, Stethoscope,
  Settings, Phone, CreditCard, Activity, Clock, ShieldCheck,
  Eye, EyeOff, Sparkles, Home, FileText, Pill, DollarSign,
  TrendingUp, BarChart3, X, Save, Award
} from 'lucide-react'

export default function StaffPortal() {
  const { clinicSlug } = useParams()
  const [clinic, setClinic] = useState(null)
  const [clinicLoading, setClinicLoading] = useState(true)
  const [clinicError, setClinicError] = useState(false)
  const [view, setView] = useState('login')
  const [user, setUser] = useState(null)

  useEffect(() => { loadClinic() }, [clinicSlug])

  const loadClinic = async () => {
    setClinicLoading(true)
    const { data, error } = await supabase
      .from('clinics').select('*')
      .eq('slug', clinicSlug).eq('is_active', true).maybeSingle()

    if (error || !data) { setClinicError(true) }
    else {
      setClinic(data)
      const saved = localStorage.getItem(`staff_session_${data.id}`)
      if (saved) {
        try {
          const s = JSON.parse(saved)
          setUser(s.user); setView(s.view)
        } catch (e) {}
      }
    }
    setClinicLoading(false)
  }

  const handleLogout = () => {
    if (clinic) localStorage.removeItem(`staff_session_${clinic.id}`)
    setUser(null); setView('login')
  }

  const handleLoginSuccess = (user, viewType) => {
    if (clinic) localStorage.setItem(`staff_session_${clinic.id}`, JSON.stringify({ user, view: viewType }))
    setUser(user); setView(viewType)
  }

  if (clinicLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center text-white">
          <div className="inline-block w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="mt-4 font-medium">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (clinicError || !clinic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900 p-4">
        <div className="glass-dark rounded-3xl p-12 max-w-md w-full text-center shadow-2xl">
          <div className="text-7xl mb-4">😕</div>
          <h2 className="text-2xl font-black text-white mb-2">العيادة غير موجودة</h2>
          <Link to="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl btn-glow">
            <Home className="w-5 h-5" /> الرئيسية
          </Link>
        </div>
      </div>
    )
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
          <StaffLogin clinic={clinic} onSuccess={handleLoginSuccess} />
        </>
      )}
      {view === 'admin' && <AdminDashboard user={user} clinic={clinic} onLogout={handleLogout} />}
      {view === 'doctor' && <DoctorDashboard user={user} clinic={clinic} onLogout={handleLogout} />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// 🔐 Login
// ═══════════════════════════════════════════════════════════
function StaffLogin({ clinic, onSuccess }) {
  const [userType, setUserType] = useState('admin')
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      if (userType === 'admin') {
        const { data, error: err } = await supabase
          .from('admin_users').select('*')
          .eq('clinic_id', clinic.id)
          .eq('username', credentials.username.trim())
          .eq('password', credentials.password)
          .in('role', ['clinic_admin', 'super_admin']).limit(1)
        if (err) { setError('❌ خطأ في الاتصال'); return }
        if (data && data.length > 0) onSuccess(data[0], 'admin')
        else setError('❌ بيانات الدخول غير صحيحة')
      } else {
        const { data, error: err } = await supabase
          .from('doctors').select('*')
          .eq('clinic_id', clinic.id)
          .eq('username', credentials.username.trim())
          .eq('password', credentials.password).limit(1)
        if (err) { setError('❌ خطأ في الاتصال'); return }
        if (data && data.length > 0) onSuccess(data[0], 'doctor')
        else setError('❌ بيانات الدخول غير صحيحة')
      }
    } catch (err) { setError('❌ حصل خطأ') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 page-enter">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block mb-4 relative">
            <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-2xl"></div>
            <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center">
              <ShieldCheck className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white mb-1">{clinic.name}</h1>
          <p className="text-white/70 text-sm">بوابة الموظفين</p>
        </div>

        <div className="glass-dark rounded-3xl p-8 shadow-2xl animate-slide-up">
          <div className="grid grid-cols-2 gap-2 mb-6 bg-white/5 p-1.5 rounded-2xl">
            <button onClick={() => setUserType('admin')}
              className={`py-3 rounded-xl font-bold transition ${userType === 'admin' ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg' : 'text-white/70 hover:text-white'}`}>
              ⚙️ أدمن
            </button>
            <button onClick={() => setUserType('doctor')}
              className={`py-3 rounded-xl font-bold transition ${userType === 'doctor' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' : 'text-white/70 hover:text-white'}`}>
              👨‍⚕️ دكتور
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-white/90 mb-2">اسم المستخدم</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input type="text" value={credentials.username} onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  placeholder={userType === 'admin' ? 'admin' : 'doctor'} required
                  className="w-full pr-12 pl-4 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder-white/40 text-right focus:border-purple-400 outline-none transition font-medium" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-white/90 mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input type={showPassword ? 'text' : 'password'} value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  placeholder="••••••" required
                  className="w-full pr-12 pl-12 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder-white/40 text-right focus:border-purple-400 outline-none transition font-medium" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && (
              <div className="bg-red-500/20 border-2 border-red-500/40 text-red-200 p-4 rounded-2xl text-sm font-medium animate-fade-in">{error}</div>
            )}
            <button type="submit" disabled={loading}
              className={`w-full py-4 text-white font-bold rounded-2xl btn-glow disabled:opacity-50 shadow-xl text-lg ${userType === 'admin' ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-green-600 to-emerald-600'}`}>
              {loading ? '⏳ جاري الدخول...' : '🚀 دخول'}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link to="/" className="text-white/60 hover:text-white text-sm inline-flex items-center gap-1">
              <Home className="w-4 h-4" /> الرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// ⚙️ Admin Dashboard - مع تقارير ورسوم بيانية
// ═══════════════════════════════════════════════════════════
function AdminDashboard({ user, clinic, onLogout }) {
  const [tab, setTab] = useState('dashboard')
  const [stats, setStats] = useState({ patients: 0, doctors: 0, todayAppts: 0, openComplaints: 0, totalRevenue: 0, monthRevenue: 0 })
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [complaints, setComplaints] = useState([])
  const [services, setServices] = useState([])
  const [records, setRecords] = useState([])

  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    const today = new Date().toISOString().split('T')[0]
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    const monthStart = startOfMonth.toISOString().split('T')[0]

    const [p, d, a, c, s, r] = await Promise.all([
      supabase.from('patients').select('*').eq('clinic_id', clinic.id).order('created_at', { ascending: false }),
      supabase.from('doctors').select('*').eq('clinic_id', clinic.id).order('created_at', { ascending: false }),
      supabase.from('appointments').select('*, patients(*), doctors(*)').eq('clinic_id', clinic.id).order('appointment_date', { ascending: false }),
      supabase.from('complaints').select('*, patients(*)').eq('clinic_id', clinic.id).order('created_at', { ascending: false }),
      supabase.from('clinic_services').select('*').eq('clinic_id', clinic.id).order('name'),
      supabase.from('medical_records').select('*, patients(name), doctors(name)').eq('clinic_id', clinic.id).order('created_at', { ascending: false })
    ])

    setPatients(p.data || [])
    setDoctors(d.data || [])
    setAppointments(a.data || [])
    setComplaints(c.data || [])
    setServices(s.data || [])
    setRecords(r.data || [])

    const totalRev = (r.data || []).reduce((sum, x) => sum + (parseFloat(x.paid_amount) || 0), 0)
    const monthRev = (r.data || []).filter(x => x.created_at >= monthStart).reduce((sum, x) => sum + (parseFloat(x.paid_amount) || 0), 0)

    setStats({
      patients: p.data?.length || 0,
      doctors: d.data?.length || 0,
      todayAppts: a.data?.filter(x => x.appointment_date === today).length || 0,
      openComplaints: c.data?.filter(x => x.status === 'open').length || 0,
      totalRevenue: totalRev,
      monthRevenue: monthRev,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 page-enter" dir="rtl">
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-black text-xl">{clinic?.name}</h1>
                <p className="text-white/80 text-xs">⚙️ {user.full_name || user.username}</p>
              </div>
            </div>
            <button onClick={onLogout} className="bg-white/20 hover:bg-red-500/40 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-bold">خروج</span>
            </button>
          </div>

          <div className="flex gap-2 mt-5 overflow-x-auto pb-1">
            {[
              { id: 'dashboard', label: 'الرئيسية', icon: '📊' },
              { id: 'reports', label: 'التقارير', icon: '📈' },
              { id: 'patients', label: 'المرضى', icon: '👥' },
              { id: 'doctors', label: 'الأطباء', icon: '👨‍⚕️' },
              { id: 'appointments', label: 'المواعيد', icon: '📅' },
              { id: 'services', label: 'الخدمات', icon: '💼' },
              { id: 'schedules', label: 'جداول الأطباء', icon: '⏰' },
              { id: 'complaints', label: 'الشكاوى', icon: '⚠️' },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition ${tab === t.id ? 'bg-white text-indigo-600 shadow-lg' : 'text-white/80 hover:bg-white/10'}`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {tab === 'dashboard' && <DashTab stats={stats} appointments={appointments} setTab={setTab} />}
        {tab === 'reports' && <ReportsTab appointments={appointments} records={records} patients={patients} doctors={doctors} />}
        {tab === 'patients' && <PatientsTab patients={patients} clinic={clinic} onUpdate={loadAll} />}
        {tab === 'doctors' && <DoctorsTab doctors={doctors} clinic={clinic} onUpdate={loadAll} />}
        {tab === 'appointments' && <AppointmentsManageTab appointments={appointments} onUpdate={loadAll} />}
        {tab === 'services' && <ServicesTab services={services} clinic={clinic} onUpdate={loadAll} />}
        {tab === 'schedules' && <SchedulesManageTab doctors={doctors} clinic={clinic} />}
        {tab === 'complaints' && <ComplaintsManageTab complaints={complaints} onUpdate={loadAll} />}
      </div>
    </div>
  )
}

function DashTab({ stats, appointments, setTab }) {
  const today = new Date().toISOString().split('T')[0]
  const todayAppts = appointments.filter(a => a.appointment_date === today)
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black text-gray-800">نظرة عامة 📊</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <BigStat icon="👥" label="إجمالي المرضى" value={stats.patients} gradient="from-blue-500 to-cyan-600" onClick={() => setTab('patients')} />
        <BigStat icon="👨‍⚕️" label="الأطباء" value={stats.doctors} gradient="from-green-500 to-emerald-600" onClick={() => setTab('doctors')} />
        <BigStat icon="📅" label="مواعيد اليوم" value={stats.todayAppts} gradient="from-purple-500 to-pink-600" onClick={() => setTab('appointments')} />
        <BigStat icon="⚠️" label="شكاوى مفتوحة" value={stats.openComplaints} gradient="from-orange-500 to-red-600" onClick={() => setTab('complaints')} />
        <BigStat icon="💰" label="إيراد الشهر" value={`${stats.monthRevenue.toFixed(0)}`} gradient="from-yellow-500 to-orange-600" suffix="ر.س" onClick={() => setTab('reports')} />
        <BigStat icon="💵" label="إجمالي الإيرادات" value={`${stats.totalRevenue.toFixed(0)}`} gradient="from-emerald-500 to-teal-600" suffix="ر.س" onClick={() => setTab('reports')} />
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-indigo-600" /> مواعيد اليوم
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

function BigStat({ icon, label, value, gradient, onClick, suffix }) {
  return (
    <button onClick={onClick} className={`bg-gradient-to-br ${gradient} text-white rounded-3xl p-6 text-right shadow-xl card-hover`}>
      <div className="text-4xl mb-2">{icon}</div>
      <p className="text-3xl font-black">{value}{suffix && <span className="text-sm mr-1 opacity-80">{suffix}</span>}</p>
      <p className="text-white/80 text-sm font-medium mt-1">{label}</p>
    </button>
  )
}

function AdminApptCard({ apt }) {
  const colors = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-green-100 text-green-700', completed: 'bg-blue-100 text-blue-700', cancelled: 'bg-red-100 text-red-700' }
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

// ─── Reports Tab (تقارير ورسوم بيانية) ──────────────────────
function ReportsTab({ appointments, records, patients, doctors }) {
  // إحصائيات المواعيد حسب النوع
  const apptByType = {
    first_visit: appointments.filter(a => a.type === 'first_visit').length,
    follow_up: appointments.filter(a => a.type === 'follow_up').length,
    emergency: appointments.filter(a => a.type === 'emergency').length,
    consultation: appointments.filter(a => a.type === 'consultation').length,
  }
  const totalAppt = appointments.length || 1

  // إحصائيات المواعيد حسب الحالة
  const apptByStatus = {
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  }

  // إيرادات حسب الشهر (آخر 6 شهور)
  const monthlyRevenue = {}
  records.forEach(r => {
    const month = r.created_at?.substring(0, 7)
    if (month) monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (parseFloat(r.paid_amount) || 0)
  })
  const sortedMonths = Object.keys(monthlyRevenue).sort().slice(-6)
  const maxRevenue = Math.max(...Object.values(monthlyRevenue), 1)

  // إحصائيات الأطباء
  const doctorStats = doctors.map(d => ({
    name: d.name,
    appointments: appointments.filter(a => a.doctor_id === d.id).length,
    revenue: records.filter(r => r.doctor_id === d.id).reduce((sum, r) => sum + (parseFloat(r.paid_amount) || 0), 0)
  })).sort((a, b) => b.appointments - a.appointments)

  const exportCSV = () => {
    const rows = [['الاسم', 'الجوال', 'تاريخ التسجيل']]
    patients.forEach(p => {
      rows.push([p.name, p.phone, new Date(p.created_at).toLocaleDateString('ar-EG')])
    })
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `patients-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-3xl font-black text-gray-800">📈 التقارير والإحصائيات</h2>
        <button onClick={exportCSV}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3 rounded-2xl font-bold shadow-xl btn-glow flex items-center gap-2">
          📥 تصدير قائمة المرضى (CSV)
        </button>
      </div>

      {/* المواعيد حسب النوع */}
      <div className="bg-white rounded-3xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📊 المواعيد حسب النوع</h3>
        <div className="space-y-3">
          {[
            { key: 'first_visit', label: '🆕 كشف أول', color: 'from-red-500 to-pink-600' },
            { key: 'follow_up', label: '🔄 متابعة', color: 'from-green-500 to-emerald-600' },
            { key: 'emergency', label: '🚨 طوارئ', color: 'from-orange-500 to-red-600' },
            { key: 'consultation', label: '💬 استشارة', color: 'from-blue-500 to-indigo-600' },
          ].map(t => (
            <div key={t.key}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-gray-700">{t.label}</span>
                <span className="text-sm font-bold text-gray-600">{apptByType[t.key]}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${t.color} transition-all duration-700`}
                  style={{width: `${(apptByType[t.key] / totalAppt) * 100}%`}}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* المواعيد حسب الحالة */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📅 المواعيد حسب الحالة</h3>
          <div className="grid grid-cols-2 gap-3">
            <StatusCircle label="قيد التأكيد" value={apptByStatus.pending} color="yellow" icon="⏳" />
            <StatusCircle label="مؤكد" value={apptByStatus.confirmed} color="green" icon="✅" />
            <StatusCircle label="مكتمل" value={apptByStatus.completed} color="blue" icon="✔️" />
            <StatusCircle label="ملغي" value={apptByStatus.cancelled} color="red" icon="❌" />
          </div>
        </div>

        {/* إيرادات الشهور */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4">💰 إيرادات آخر 6 شهور</h3>
          {sortedMonths.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">💸</div>
              <p>لا توجد إيرادات بعد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedMonths.map(month => (
                <div key={month}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-bold text-gray-700">{month}</span>
                    <span className="text-sm font-bold text-green-600">{monthlyRevenue[month].toFixed(0)} ر.س</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-700"
                      style={{width: `${(monthlyRevenue[month] / maxRevenue) * 100}%`}}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* أداء الأطباء */}
      <div className="bg-white rounded-3xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4">👨‍⚕️ أداء الأطباء</h3>
        {doctorStats.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">👨‍⚕️</div>
            <p>لا يوجد أطباء</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {doctorStats.map((d, i) => (
              <div key={i} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border-2 border-green-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-2xl">👨‍⚕️</div>
                  <p className="font-bold text-gray-800">{d.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-green-600">{d.appointments}</p>
                    <p className="text-xs text-gray-600">مواعيد</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-orange-600">{d.revenue.toFixed(0)}</p>
                    <p className="text-xs text-gray-600">إيراد (ر.س)</p>
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

function StatusCircle({ label, value, color, icon }) {
  const colors = {
    yellow: 'from-yellow-400 to-orange-500',
    green: 'from-green-400 to-emerald-500',
    blue: 'from-blue-400 to-indigo-500',
    red: 'from-red-400 to-pink-500',
  }
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-4 text-white text-center`}>
      <div className="text-3xl mb-1">{icon}</div>
      <p className="text-3xl font-black">{value}</p>
      <p className="text-xs font-medium opacity-90">{label}</p>
    </div>
  )
}

// ─── Patients Tab ──────────────────────
function PatientsTab({ patients, clinic, onUpdate }) {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', national_id: '', gender: 'male', password: '123456' })

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search) || p.national_id?.includes(search)
  )

  const startEdit = (p) => {
    setEditing(p)
    setForm({ name: p.name, phone: p.phone, national_id: p.national_id || '', gender: p.gender || 'male', password: p.password })
    setShowForm(true)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (editing) {
      const { error } = await supabase.from('patients').update(form).eq('id', editing.id)
      if (error) { alert('❌ ' + error.message); return }
    } else {
      const { error } = await supabase.from('patients').insert([{ ...form, clinic_id: clinic.id }])
      if (error) { alert('❌ ' + error.message); return }
    }
    setForm({ name: '', phone: '', national_id: '', gender: 'male', password: '123456' })
    setShowForm(false); setEditing(null); onUpdate()
  }

  const del = async (id) => {
    if (!confirm('حذف المريض؟')) return
    await supabase.from('patients').delete().eq('id', id); onUpdate()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <h2 className="text-3xl font-black text-gray-800">👥 إدارة المرضى</h2>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', phone: '', national_id: '', gender: 'male', password: '123456' }) }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-2xl font-bold shadow-xl btn-glow flex items-center gap-2">
          <Plus className="w-5 h-5" /> {showForm ? 'إلغاء' : 'مريض جديد'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-3xl p-6 shadow-xl animate-slide-up">
          <h3 className="text-xl font-bold mb-4">{editing ? '✏️ تعديل المريض' : '➕ مريض جديد'}</h3>
          <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
            <input required placeholder="الاسم *" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none" />
            <input required placeholder="رقم الجوال *" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none" />
            <input placeholder="رقم الهوية" value={form.national_id} onChange={(e) => setForm({...form, national_id: e.target.value})}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none" />
            <select value={form.gender} onChange={(e) => setForm({...form, gender: e.target.value})}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none">
              <option value="male">ذكر</option><option value="female">أنثى</option>
            </select>
            <input placeholder="كلمة المرور" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none md:col-span-2" />
            <button type="submit" className="md:col-span-2 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg">
              {editing ? '💾 حفظ التعديلات' : '✅ حفظ المريض'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 shadow-xl">
        <div className="relative mb-4">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input placeholder="🔍 بحث..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 outline-none" />
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
                <div className="flex items-start justify-between flex-wrap gap-2">
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
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(p)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => del(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                      <Trash2 className="w-5 h-5" />
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

// ─── Doctors Tab ──────────────────────
function DoctorsTab({ doctors, clinic, onUpdate }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', specialization: '', phone: '', username: '', password: '123456' })

  const add = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('doctors').insert([{ ...form, clinic_id: clinic.id }])
    if (error) { alert('❌ ' + error.message); return }
    setForm({ name: '', specialization: '', phone: '', username: '', password: '123456' })
    setShowForm(false); onUpdate()
  }

  const del = async (id) => {
    if (!confirm('حذف الطبيب؟')) return
    await supabase.from('doctors').delete().eq('id', id); onUpdate()
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
            <input required placeholder="اسم المستخدم *" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})}
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
            <p>لا يوجد أطباء</p>
          </div>
        ) : doctors.map(d => (
          <div key={d.id} className="bg-white rounded-2xl p-5 shadow-lg card-hover">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-3xl">👨‍⚕️</div>
                <div>
                  <p className="font-bold text-gray-800 text-lg">{d.name}</p>
                  <p className="text-sm text-gray-600">{d.specialization}</p>
                  <p className="text-xs text-gray-500 mt-1">📞 {d.phone}</p>
                  <p className="text-xs text-gray-500">👤 {d.username}</p>
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

// ─── Services Tab (جديد) ──────────────────────
function ServicesTab({ services, clinic, onUpdate }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', price: 0, duration_minutes: 30 })

  const startEdit = (s) => {
    setEditing(s)
    setForm({ name: s.name, description: s.description || '', price: s.price, duration_minutes: s.duration_minutes })
    setShowForm(true)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (editing) {
      const { error } = await supabase.from('clinic_services').update(form).eq('id', editing.id)
      if (error) { alert('❌ ' + error.message); return }
    } else {
      const { error } = await supabase.from('clinic_services').insert([{ ...form, clinic_id: clinic.id }])
      if (error) { alert('❌ ' + error.message); return }
    }
    setForm({ name: '', description: '', price: 0, duration_minutes: 30 })
    setShowForm(false); setEditing(null); onUpdate()
  }

  const del = async (id) => {
    if (!confirm('حذف الخدمة؟')) return
    await supabase.from('clinic_services').delete().eq('id', id); onUpdate()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <h2 className="text-3xl font-black text-gray-800">💼 إدارة الخدمات والأسعار</h2>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', description: '', price: 0, duration_minutes: 30 }) }}
          className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-5 py-3 rounded-2xl font-bold shadow-xl btn-glow flex items-center gap-2">
          <Plus className="w-5 h-5" /> {showForm ? 'إلغاء' : 'خدمة جديدة'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-3xl p-6 shadow-xl animate-slide-up">
          <h3 className="text-xl font-bold mb-4">{editing ? '✏️ تعديل الخدمة' : '➕ خدمة جديدة'}</h3>
          <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
            <input required placeholder="اسم الخدمة *" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none md:col-span-2" />
            <input type="number" required placeholder="السعر *" value={form.price} onChange={(e) => setForm({...form, price: parseFloat(e.target.value) || 0})}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none" />
            <input type="number" required placeholder="المدة (دقيقة)" value={form.duration_minutes} onChange={(e) => setForm({...form, duration_minutes: parseInt(e.target.value) || 30})}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none" />
            <textarea placeholder="الوصف" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows="2"
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none md:col-span-2 resize-none" />
            <button type="submit" className="md:col-span-2 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl font-bold shadow-lg">
              {editing ? '💾 حفظ' : '✅ إضافة'}
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {services.length === 0 ? (
          <div className="md:col-span-2 bg-white rounded-3xl p-12 text-center text-gray-500 shadow-xl">
            <div className="text-5xl mb-2">💼</div>
            <p>لا توجد خدمات</p>
          </div>
        ) : services.map(s => (
          <div key={s.id} className="bg-white rounded-2xl p-5 shadow-lg card-hover">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg">{s.name}</h3>
                {s.description && <p className="text-sm text-gray-600 mt-1">{s.description}</p>}
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="text-2xl font-black text-yellow-600">{s.price} ر.س</span>
                  <span className="text-gray-500 flex items-center gap-1"><Clock className="w-4 h-4" /> {s.duration_minutes} دقيقة</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(s)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg">
                  <Edit className="w-5 h-5" />
                </button>
                <button onClick={() => del(s.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Appointments Manage ──────────────────────
function AppointmentsManageTab({ appointments, onUpdate }) {
  const updateStatus = async (id, status) => {
    await supabase.from('appointments').update({ status }).eq('id', id); onUpdate()
  }
  const del = async (id) => {
    if (!confirm('حذف الموعد؟')) return
    await supabase.from('appointments').delete().eq('id', id); onUpdate()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black text-gray-800">📅 المواعيد</h2>
      <div className="bg-white rounded-3xl p-6 shadow-xl">
        {appointments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-2">📅</div><p>لا توجد مواعيد</p>
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
                    <select value={apt.status} onChange={(e) => updateStatus(apt.id, e.target.value)}
                      className="px-3 py-2 border-2 border-gray-200 rounded-xl text-sm font-bold focus:border-indigo-500 outline-none">
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

// ─── Complaints Manage ──────────────────────
function ComplaintsManageTab({ complaints, onUpdate }) {
  const [editingId, setEditingId] = useState(null)
  const [response, setResponse] = useState('')
  const respond = async (id, status) => {
    await supabase.from('complaints').update({
      response, status, resolved_at: status === 'resolved' ? new Date().toISOString() : null
    }).eq('id', id)
    setEditingId(null); setResponse(''); onUpdate()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black text-gray-800">⚠️ الشكاوى</h2>
      <div className="bg-white rounded-3xl p-6 shadow-xl">
        {complaints.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-2">✨</div><p>لا توجد شكاوى</p>
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
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.status === 'open' ? 'bg-red-100 text-red-700' : c.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
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
                    <textarea value={response} onChange={(e) => setResponse(e.target.value)} placeholder="اكتب الرد..." rows="3"
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none" />
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
// ⏰ Schedules Management - إدارة جداول الأطباء (للأدمن)
// ═══════════════════════════════════════════════════════════
function SchedulesManageTab({ doctors, clinic }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const [timePerSlot, setTimePerSlot] = useState(30)

  const dayNames = [
    { num: 6, name: 'السبت', short: 'سبت' },
    { num: 0, name: 'الأحد', short: 'أحد' },
    { num: 1, name: 'الإثنين', short: 'إثنين' },
    { num: 2, name: 'الثلاثاء', short: 'ثلاثاء' },
    { num: 3, name: 'الأربعاء', short: 'أربعاء' },
    { num: 4, name: 'الخميس', short: 'خميس' },
    { num: 5, name: 'الجمعة', short: 'جمعة' },
  ]

  useEffect(() => {
    if (selectedDoctor) loadSchedules()
  }, [selectedDoctor])

  const loadSchedules = async () => {
    setLoading(true)
    const { data } = await supabase.from('doctor_schedules')
      .select('*').eq('doctor_id', selectedDoctor.id).order('day_of_week')
    setSchedules(data || [])
    setTimePerSlot(selectedDoctor.time_per_slot || 30)
    setLoading(false)
  }

  const toggleDay = (dayNum) => {
    const existing = schedules.find(s => s.day_of_week === dayNum)
    if (existing) {
      setSchedules(schedules.filter(s => s.day_of_week !== dayNum))
    } else {
      setSchedules([...schedules, {
        clinic_id: clinic.id, doctor_id: selectedDoctor.id,
        day_of_week: dayNum, start_time: '09:00', end_time: '21:00',
        is_available: true, _new: true
      }])
    }
  }

  const updateTime = (dayNum, field, value) => {
    setSchedules(schedules.map(s => s.day_of_week === dayNum ? {...s, [field]: value} : s))
  }

  const saveAll = async () => {
    setLoading(true)
    // امسح الجدول القديم
    await supabase.from('doctor_schedules').delete().eq('doctor_id', selectedDoctor.id)

    // ضيف الجديد
    if (schedules.length > 0) {
      const toInsert = schedules.map(s => ({
        clinic_id: clinic.id, doctor_id: selectedDoctor.id,
        day_of_week: s.day_of_week,
        start_time: s.start_time, end_time: s.end_time,
        is_available: true
      }))
      await supabase.from('doctor_schedules').insert(toInsert)
    }

    // حدّث time_per_slot
    await supabase.from('doctors').update({ time_per_slot: parseInt(timePerSlot) }).eq('id', selectedDoctor.id)

    setLoading(false)
    setSavedMsg('✅ تم الحفظ بنجاح')
    setTimeout(() => setSavedMsg(''), 3000)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black text-gray-800">⏰ إدارة جداول الأطباء</h2>

      {/* اختيار الطبيب */}
      <div className="bg-white rounded-3xl p-6 shadow-xl">
        <h3 className="font-bold text-gray-800 mb-3">اختر طبيب لتعديل جدوله:</h3>
        {doctors.length === 0 ? (
          <p className="text-gray-500 text-center py-6">⚠️ لا يوجد أطباء. أضف أطباء أولاً.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {doctors.map(d => (
              <button key={d.id} onClick={() => setSelectedDoctor(d)}
                className={`p-4 rounded-2xl text-right transition ${
                  selectedDoctor?.id === d.id ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl scale-105' :
                  'bg-gray-50 hover:bg-indigo-50 border-2 border-gray-200'
                }`}>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">👨‍⚕️</div>
                  <div>
                    <p className="font-bold">{d.name}</p>
                    <p className={`text-xs ${selectedDoctor?.id === d.id ? 'text-white/80' : 'text-gray-500'}`}>{d.specialization}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* تعديل الجدول */}
      {selectedDoctor && (
        <ScheduleEditor
          doctor={selectedDoctor}
          schedules={schedules}
          timePerSlot={timePerSlot}
          setTimePerSlot={setTimePerSlot}
          dayNames={dayNames}
          onToggleDay={toggleDay}
          onUpdateTime={updateTime}
          onSave={saveAll}
          loading={loading}
          savedMsg={savedMsg}
        />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// 📅 Schedule Editor (مشترك بين الأدمن والدكتور)
// ═══════════════════════════════════════════════════════════
function ScheduleEditor({ doctor, schedules, timePerSlot, setTimePerSlot, dayNames, onToggleDay, onUpdateTime, onSave, loading, savedMsg }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl animate-slide-up">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
          <Clock className="w-6 h-6 text-indigo-600" />
          جدول عمل {doctor.name}
        </h3>
        {savedMsg && (
          <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-2 rounded-xl font-bold animate-fade-in">
            {savedMsg}
          </div>
        )}
      </div>

      {/* مدة الموعد */}
      <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 mb-6">
        <label className="block text-sm font-bold text-indigo-900 mb-2">⏱️ مدة الموعد الواحد:</label>
        <div className="grid grid-cols-5 gap-2">
          {[15, 20, 30, 45, 60].map(m => (
            <button key={m} onClick={() => setTimePerSlot(m)}
              className={`py-3 rounded-xl font-bold transition ${
                timePerSlot === m ? 'bg-indigo-600 text-white shadow-lg scale-105' :
                'bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-400'
              }`}>
              {m} د
            </button>
          ))}
        </div>
      </div>

      {/* أيام العمل */}
      <div className="space-y-3 mb-6">
        <p className="font-bold text-gray-700 mb-2">📆 اختر أيام العمل وحدد ساعاتها:</p>
        {dayNames.map(day => {
          const schedule = schedules.find(s => s.day_of_week === day.num)
          const isWorking = !!schedule
          return (
            <div key={day.num} className={`border-2 rounded-2xl p-4 transition ${
              isWorking ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <button onClick={() => onToggleDay(day.num)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition ${
                      isWorking ? 'bg-green-500 text-white shadow-lg' : 'bg-white border-2 border-gray-300 text-gray-400'
                    }`}>
                    {isWorking ? '✓' : '○'}
                  </button>
                  <div>
                    <p className="font-bold text-gray-800">{day.name}</p>
                    <p className={`text-xs ${isWorking ? 'text-green-700' : 'text-gray-500'}`}>
                      {isWorking ? 'يوم عمل' : 'إجازة'}
                    </p>
                  </div>
                </div>

                {isWorking && (
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-600 mb-1">من</label>
                      <input type="time" value={schedule.start_time?.substring(0,5)}
                        onChange={(e) => onUpdateTime(day.num, 'start_time', e.target.value)}
                        className="px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none font-bold" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-600 mb-1">إلى</label>
                      <input type="time" value={schedule.end_time?.substring(0,5)}
                        onChange={(e) => onUpdateTime(day.num, 'end_time', e.target.value)}
                        className="px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none font-bold" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* الإحصائية */}
      {schedules.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 mb-4 text-sm">
          <p className="font-bold text-indigo-900">
            ✅ {schedules.length} أيام عمل • ⏱️ مدة الموعد {timePerSlot} دقيقة
          </p>
        </div>
      )}

      <button onClick={onSave} disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black rounded-2xl btn-glow disabled:opacity-50 shadow-2xl text-lg">
        {loading ? '⏳ جاري الحفظ...' : '💾 حفظ الجدول'}
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// 👨‍⚕️ Doctor Dashboard - مع أدوات متقدمة (تشخيص + وصفة + إكمال)
// ═══════════════════════════════════════════════════════════
function DoctorDashboard({ user, clinic, onLogout }) {
  const [appointments, setAppointments] = useState([])
  const [services, setServices] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [examiningApt, setExaminingApt] = useState(null)
  const [doctorTab, setDoctorTab] = useState('patients') // patients | schedule

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const [a, s] = await Promise.all([
      supabase.from('appointments').select('*, patients(*), medical_records(*)').eq('doctor_id', user.id).order('appointment_date', { ascending: false }).order('appointment_time'),
      supabase.from('clinic_services').select('*').eq('clinic_id', clinic.id).eq('is_active', true)
    ])
    setAppointments(a.data || [])
    setServices(s.data || [])
    setLoading(false)
  }

  const filtered = appointments.filter(apt => {
    const matchSearch = !search ||
      apt.patients?.name?.toLowerCase().includes(search.toLowerCase()) ||
      apt.patients?.phone?.includes(search) || apt.patients?.national_id?.includes(search)
    const matchFilter = filter === 'all' || apt.type === filter
    return matchSearch && matchFilter
  })

  const firstVisits = appointments.filter(a => a.type === 'first_visit')
  const emergencies = appointments.filter(a => a.type === 'emergency')
  const followUps = appointments.filter(a => a.type === 'follow_up')

  if (examiningApt) {
    return <ExaminationView apt={examiningApt} clinic={clinic} services={services} doctor={user}
      onClose={() => { setExaminingApt(null); load() }} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 page-enter" dir="rtl">
      <header className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 shadow-2xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm text-2xl">👨‍⚕️</div>
              <div>
                <h1 className="text-white font-black text-xl">{user.name}</h1>
                <p className="text-white/80 text-xs">{user.specialization} • {clinic?.name}</p>
              </div>
            </div>
            <button onClick={onLogout} className="bg-white/20 hover:bg-red-500/40 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-bold">خروج</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-5 overflow-x-auto pb-1">
            <button onClick={() => setDoctorTab('patients')}
              className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition ${doctorTab === 'patients' ? 'bg-white text-green-600 shadow-lg' : 'text-white/80 hover:bg-white/10'}`}>
              👥 المرضى
            </button>
            <button onClick={() => setDoctorTab('schedule')}
              className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition ${doctorTab === 'schedule' ? 'bg-white text-green-600 shadow-lg' : 'text-white/80 hover:bg-white/10'}`}>
              ⏰ جدول عملي
            </button>
          </div>
        </div>
      </header>

      {doctorTab === 'schedule' ? (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <DoctorScheduleTab doctor={user} clinic={clinic} />
        </div>
      ) : (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <BigStat icon="🆕" label="كشف أول" value={firstVisits.length} gradient="from-red-500 to-pink-600" onClick={() => setFilter('first_visit')} />
          <BigStat icon="🚨" label="طوارئ" value={emergencies.length} gradient="from-orange-500 to-red-600" onClick={() => setFilter('emergency')} />
          <BigStat icon="🔄" label="متابعات" value={followUps.length} gradient="from-green-500 to-emerald-600" onClick={() => setFilter('follow_up')} />
          <BigStat icon="📋" label="الكل" value={appointments.length} gradient="from-indigo-500 to-purple-600" onClick={() => setFilter('all')} />
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input placeholder="🔍 بحث بالاسم أو الجوال أو الهوية..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-green-500 outline-none" />
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

        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📋 قائمة المرضى ({filtered.length})</h3>
          {loading ? (
            <div className="text-center py-12"><div className="inline-block w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500"><div className="text-5xl mb-2">📭</div><p>لا يوجد مرضى</p></div>
          ) : (
            <div className="space-y-3">
              {filtered.map(apt => (
                <div key={apt.id} className={`border-r-4 rounded-2xl p-4 ${apt.type === 'first_visit' ? 'border-red-500 bg-red-50' : apt.type === 'emergency' ? 'border-orange-500 bg-orange-50' : apt.type === 'follow_up' ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'}`}>
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow">
                        {apt.patients?.gender === 'female' ? '👩' : '👨'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-lg">{apt.patients?.name}</p>
                        <p className="text-sm text-gray-600">📞 {apt.patients?.phone}</p>
                        {apt.patients?.medical_notes && <p className="text-xs text-gray-600 mt-1">📋 {apt.patients.medical_notes}</p>}
                        {apt.medical_records && apt.medical_records.length > 0 && (
                          <p className="text-xs text-green-700 font-bold mt-1">✅ تم الكشف ({apt.medical_records.length} مرة)</p>
                        )}
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-700">📅 {apt.appointment_date}</p>
                      <p className="text-gray-600">⏰ {apt.appointment_time}</p>
                      <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${apt.type === 'first_visit' ? 'bg-red-200 text-red-800' : apt.type === 'emergency' ? 'bg-orange-200 text-orange-800' : apt.type === 'follow_up' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'}`}>
                        {apt.type === 'first_visit' ? '🆕 كشف أول' : apt.type === 'emergency' ? '🚨 طوارئ' : apt.type === 'follow_up' ? '🔄 متابعة' : '💬 استشارة'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2 flex-wrap">
                    <button onClick={() => setExaminingApt(apt)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg btn-glow flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" />
                      {apt.medical_records?.length > 0 ? '✏️ تعديل/إضافة كشف' : '🩺 بدء الكشف'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// ⏰ تبويب جدول الدكتور (يديره بنفسه)
// ═══════════════════════════════════════════════════════════
function DoctorScheduleTab({ doctor, clinic }) {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const [timePerSlot, setTimePerSlot] = useState(doctor.time_per_slot || 30)
  const [showFirstTimeMsg, setShowFirstTimeMsg] = useState(false)

  const dayNames = [
    { num: 6, name: 'السبت', short: 'سبت' },
    { num: 0, name: 'الأحد', short: 'أحد' },
    { num: 1, name: 'الإثنين', short: 'إثنين' },
    { num: 2, name: 'الثلاثاء', short: 'ثلاثاء' },
    { num: 3, name: 'الأربعاء', short: 'أربعاء' },
    { num: 4, name: 'الخميس', short: 'خميس' },
    { num: 5, name: 'الجمعة', short: 'جمعة' },
  ]

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('doctor_schedules')
      .select('*').eq('doctor_id', doctor.id).order('day_of_week')
    setSchedules(data || [])
    if (!data || data.length === 0) setShowFirstTimeMsg(true)
    setLoading(false)
  }

  const toggleDay = (dayNum) => {
    const existing = schedules.find(s => s.day_of_week === dayNum)
    if (existing) {
      setSchedules(schedules.filter(s => s.day_of_week !== dayNum))
    } else {
      setSchedules([...schedules, {
        clinic_id: clinic.id, doctor_id: doctor.id,
        day_of_week: dayNum, start_time: '09:00', end_time: '21:00',
        is_available: true, _new: true
      }])
    }
  }

  const updateTime = (dayNum, field, value) => {
    setSchedules(schedules.map(s => s.day_of_week === dayNum ? {...s, [field]: value} : s))
  }

  const saveAll = async () => {
    setLoading(true)
    await supabase.from('doctor_schedules').delete().eq('doctor_id', doctor.id)
    if (schedules.length > 0) {
      const toInsert = schedules.map(s => ({
        clinic_id: clinic.id, doctor_id: doctor.id,
        day_of_week: s.day_of_week,
        start_time: s.start_time, end_time: s.end_time,
        is_available: true
      }))
      await supabase.from('doctor_schedules').insert(toInsert)
    }
    await supabase.from('doctors').update({ time_per_slot: parseInt(timePerSlot) }).eq('id', doctor.id)
    setLoading(false)
    setShowFirstTimeMsg(false)
    setSavedMsg('✅ تم الحفظ بنجاح')
    setTimeout(() => setSavedMsg(''), 3000)
  }

  return (
    <div className="space-y-6">
      {showFirstTimeMsg && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-3xl p-6 shadow-xl animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="text-4xl">👋</div>
            <div>
              <h3 className="text-xl font-black text-orange-900 mb-2">أهلاً بك يا دكتور!</h3>
              <p className="text-orange-800">
                لازم تحدد <strong>جدول مواعيدك</strong> أولاً عشان المرضى يقدروا يحجزوا.
                <br/>اختار أيام عملك وحدد ساعاتها بالأسفل ⬇️
              </p>
            </div>
          </div>
        </div>
      )}

      <ScheduleEditor
        doctor={doctor}
        schedules={schedules}
        timePerSlot={timePerSlot}
        setTimePerSlot={setTimePerSlot}
        dayNames={dayNames}
        onToggleDay={toggleDay}
        onUpdateTime={updateTime}
        onSave={saveAll}
        loading={loading}
        savedMsg={savedMsg}
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// 🩺 شاشة الفحص - تشخيص + وصفة + فاتورة
// ═══════════════════════════════════════════════════════════
function ExaminationView({ apt, clinic, services, doctor, onClose }) {
  const existingRecord = apt.medical_records?.[0]
  const [form, setForm] = useState({
    diagnosis: existingRecord?.diagnosis || '',
    treatment: existingRecord?.treatment || '',
    prescription: existingRecord?.prescription || '',
    next_visit_notes: existingRecord?.next_visit_notes || '',
    private_notes: existingRecord?.private_notes || '',
    services_provided: existingRecord?.services_provided || [],
    discount: existingRecord?.discount || 0,
    paid_amount: existingRecord?.paid_amount || 0,
    payment_method: existingRecord?.payment_method || 'cash',
  })
  const [loading, setLoading] = useState(false)

  const total = form.services_provided.reduce((sum, s) => sum + (s.price * s.qty), 0)
  const finalTotal = total - parseFloat(form.discount || 0)
  const paymentStatus = parseFloat(form.paid_amount) >= finalTotal ? 'paid' : parseFloat(form.paid_amount) > 0 ? 'partial' : 'unpaid'

  const addService = (s) => {
    const existing = form.services_provided.find(x => x.id === s.id)
    if (existing) {
      setForm({...form, services_provided: form.services_provided.map(x => x.id === s.id ? {...x, qty: x.qty + 1} : x)})
    } else {
      setForm({...form, services_provided: [...form.services_provided, {id: s.id, name: s.name, price: s.price, qty: 1}]})
    }
  }

  const removeService = (id) => {
    setForm({...form, services_provided: form.services_provided.filter(s => s.id !== id)})
  }

  const updateQty = (id, qty) => {
    if (qty < 1) return removeService(id)
    setForm({...form, services_provided: form.services_provided.map(s => s.id === id ? {...s, qty} : s)})
  }

  const save = async (complete = false) => {
    setLoading(true)
    const recordData = {
      clinic_id: clinic.id,
      appointment_id: apt.id,
      patient_id: apt.patient_id,
      doctor_id: doctor.id,
      diagnosis: form.diagnosis,
      treatment: form.treatment,
      prescription: form.prescription,
      next_visit_notes: form.next_visit_notes,
      private_notes: form.private_notes,
      services_provided: form.services_provided,
      total_amount: finalTotal,
      discount: parseFloat(form.discount) || 0,
      paid_amount: parseFloat(form.paid_amount) || 0,
      payment_status: paymentStatus,
      payment_method: form.payment_method,
    }

    if (existingRecord) {
      await supabase.from('medical_records').update(recordData).eq('id', existingRecord.id)
    } else {
      await supabase.from('medical_records').insert([recordData])
    }

    if (complete) {
      await supabase.from('appointments').update({ status: 'completed' }).eq('id', apt.id)
    }

    setLoading(false)
    onClose()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 page-enter" dir="rtl">
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 shadow-2xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-white font-black text-xl">🩺 شاشة الكشف</h1>
            <p className="text-white/80 text-sm">{apt.patients?.name} • {apt.appointment_date}</p>
          </div>
          <button onClick={onClose} className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-5">
        {/* بيانات المريض */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-green-600" /> بيانات المريض
          </h3>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-500">الاسم:</span> <strong>{apt.patients?.name}</strong></div>
            <div><span className="text-gray-500">الجوال:</span> <strong>{apt.patients?.phone}</strong></div>
            <div><span className="text-gray-500">العمر:</span> <strong>{apt.patients?.date_of_birth ? new Date().getFullYear() - new Date(apt.patients.date_of_birth).getFullYear() : '-'}</strong></div>
            <div><span className="text-gray-500">فصيلة الدم:</span> <strong>{apt.patients?.blood_type || '-'}</strong></div>
            {apt.patients?.allergies && (
              <div className="sm:col-span-2 bg-red-50 border-2 border-red-200 rounded-xl p-3">
                <span className="text-red-700 font-bold">⚠️ حساسيات:</span> {apt.patients.allergies}
              </div>
            )}
            {apt.patients?.medical_notes && (
              <div className="sm:col-span-2 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-3">
                <span className="text-yellow-700 font-bold">📋 ملاحظات طبية:</span> {apt.patients.medical_notes}
              </div>
            )}
          </div>
        </div>

        {/* التشخيص والعلاج */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> التشخيص والعلاج
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">🔍 التشخيص</label>
              <textarea value={form.diagnosis} onChange={(e) => setForm({...form, diagnosis: e.target.value})}
                rows="3" placeholder="مثال: التهاب في اللثة، تسوس في الضرس الأيمن السفلي..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">💉 العلاج المُقدّم</label>
              <textarea value={form.treatment} onChange={(e) => setForm({...form, treatment: e.target.value})}
                rows="3" placeholder="مثال: تنظيف اللثة، حشوة بيضاء للضرس..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Pill className="w-4 h-4 text-pink-600" /> الوصفة الطبية
              </label>
              <textarea value={form.prescription} onChange={(e) => setForm({...form, prescription: e.target.value})}
                rows="3" placeholder="مثال: أوجمنتين 1g كل 12 ساعة لمدة 5 أيام، بروفين 400mg عند الألم..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">📅 ملاحظات للزيارة القادمة</label>
              <textarea value={form.next_visit_notes} onChange={(e) => setForm({...form, next_visit_notes: e.target.value})}
                rows="2" placeholder="مثال: متابعة بعد أسبوع لإكمال علاج الجذور..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">🔒 ملاحظات خاصة (للدكتور فقط)</label>
              <textarea value={form.private_notes} onChange={(e) => setForm({...form, private_notes: e.target.value})}
                rows="2" placeholder="ملاحظات لا يراها المريض..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none resize-none" />
            </div>
          </div>
        </div>

        {/* الفاتورة والخدمات */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-yellow-600" /> الفاتورة
          </h3>

          {services.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-bold text-gray-700 mb-2">➕ إضافة خدمات:</p>
              <div className="flex flex-wrap gap-2">
                {services.map(s => (
                  <button key={s.id} onClick={() => addService(s)}
                    className="bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 transition">
                    {s.name} <span className="text-yellow-700">({s.price} ر.س)</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {form.services_provided.length > 0 ? (
            <div className="space-y-2 mb-4">
              {form.services_provided.map(s => (
                <div key={s.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3 gap-2">
                  <span className="font-bold text-gray-800 flex-1">{s.name}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(s.id, s.qty - 1)} className="w-7 h-7 bg-red-100 text-red-600 rounded-lg font-bold">−</button>
                    <span className="w-8 text-center font-bold">{s.qty}</span>
                    <button onClick={() => updateQty(s.id, s.qty + 1)} className="w-7 h-7 bg-green-100 text-green-600 rounded-lg font-bold">+</button>
                    <span className="font-bold text-yellow-700 min-w-[80px] text-left">{(s.price * s.qty).toFixed(0)} ر.س</span>
                    <button onClick={() => removeService(s.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 text-sm bg-gray-50 rounded-xl mb-4">لا توجد خدمات مُضافة</div>
          )}

          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">💰 الإجمالي</label>
              <div className="px-3 py-2 bg-gray-100 rounded-xl font-bold text-lg">{total.toFixed(0)} ر.س</div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">🎁 الخصم</label>
              <input type="number" value={form.discount} onChange={(e) => setForm({...form, discount: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">💵 المبلغ المدفوع</label>
              <input type="number" value={form.paid_amount} onChange={(e) => setForm({...form, paid_amount: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none font-bold" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-4">
            <div className="grid sm:grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-gray-600">الصافي</p>
                <p className="text-2xl font-black text-orange-700">{finalTotal.toFixed(0)} ر.س</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">المتبقي</p>
                <p className="text-2xl font-black text-red-600">{Math.max(0, finalTotal - parseFloat(form.paid_amount || 0)).toFixed(0)} ر.س</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">الحالة</p>
                <p className={`text-lg font-black ${paymentStatus === 'paid' ? 'text-green-600' : paymentStatus === 'partial' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {paymentStatus === 'paid' ? '✅ مدفوع' : paymentStatus === 'partial' ? '🟡 جزئي' : '🔴 غير مدفوع'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-bold text-gray-700 mb-1">💳 طريقة الدفع</label>
            <select value={form.payment_method} onChange={(e) => setForm({...form, payment_method: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none">
              <option value="cash">💵 نقدي</option>
              <option value="card">💳 بطاقة</option>
              <option value="transfer">🏦 تحويل بنكي</option>
            </select>
          </div>
        </div>

        {/* الأزرار */}
        <div className="grid grid-cols-2 gap-3 sticky bottom-4">
          <button onClick={() => save(false)} disabled={loading}
            className="py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl btn-glow disabled:opacity-50 shadow-2xl flex items-center justify-center gap-2">
            <Save className="w-5 h-5" /> {loading ? '⏳' : 'حفظ كمسودة'}
          </button>
          <button onClick={() => save(true)} disabled={loading}
            className="py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl btn-glow disabled:opacity-50 shadow-2xl flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" /> {loading ? '⏳' : 'إنهاء وحفظ ✓'}
          </button>
        </div>
      </div>
    </div>
  )
}
