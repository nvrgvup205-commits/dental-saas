import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  User, Lock, LogOut, Building2, Plus, Phone, Mail, MapPin,
  Calendar, Trash2, Edit, Crown, Sparkles, Eye, EyeOff,
  Users, Activity, TrendingUp, CheckCircle, Clock, Copy,
  ExternalLink, Settings, Home, BarChart3, Save, X
} from 'lucide-react'

export default function OwnerPortal() {
  const [view, setView] = useState('login')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('owner_session')
    if (saved) {
      try {
        setUser(JSON.parse(saved))
        setView('dashboard')
      } catch (e) {}
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('owner_session')
    setUser(null); setView('login')
  }

  const handleSuccess = (u) => {
    localStorage.setItem('owner_session', JSON.stringify(u))
    setUser(u); setView('dashboard')
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {view === 'login' && (
        <>
          <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-yellow-900 to-gray-900 -z-10"></div>
          <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
            <div className="floating-shape w-96 h-96 bg-yellow-500 top-10 -right-20"></div>
            <div className="floating-shape w-80 h-80 bg-orange-500 bottom-20 -left-20" style={{animationDelay: '2s'}}></div>
          </div>
          <OwnerLogin onSuccess={handleSuccess} />
        </>
      )}
      {view === 'dashboard' && <OwnerDashboard user={user} onLogout={handleLogout} />}
    </div>
  )
}

function OwnerLogin({ onSuccess }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const { data } = await supabase
        .from('admin_users').select('*')
        .eq('username', credentials.username.trim())
        .eq('password', credentials.password)
        .eq('role', 'owner')
        .limit(1)
      if (data && data.length > 0) {
        onSuccess(data[0])
      } else {
        setError('❌ بيانات الدخول غير صحيحة')
      }
    } catch (err) {
      setError('❌ حصل خطأ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 page-enter">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block mb-4 relative">
            <div className="absolute inset-0 bg-yellow-500/40 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-600 rounded-3xl shadow-2xl flex items-center justify-center">
              <Crown className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white mb-2">👑 المالك</h1>
          <p className="text-white/70">لوحة تحكم صاحب النظام</p>
        </div>

        <div className="glass-dark rounded-3xl p-8 shadow-2xl animate-slide-up border border-yellow-500/20">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-yellow-200 mb-2">اسم المستخدم</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400/60" />
                <input type="text" value={credentials.username} onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  placeholder="owner" required
                  className="w-full pr-12 pl-4 py-4 bg-white/5 border-2 border-yellow-500/30 rounded-2xl text-white placeholder-white/30 text-right focus:border-yellow-400 outline-none transition font-medium" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-yellow-200 mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400/60" />
                <input type={showPassword ? 'text' : 'password'} value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  placeholder="••••••" required
                  className="w-full pr-12 pl-12 py-4 bg-white/5 border-2 border-yellow-500/30 rounded-2xl text-white placeholder-white/30 text-right focus:border-yellow-400 outline-none transition font-medium" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400/60 hover:text-yellow-300">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border-2 border-red-500/40 text-red-200 p-4 rounded-2xl text-sm font-medium animate-fade-in">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-2xl btn-glow disabled:opacity-50 shadow-xl text-lg">
              {loading ? '⏳ جاري الدخول...' : '👑 دخول المالك'}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link to="/" className="text-yellow-300/70 hover:text-yellow-200 text-sm inline-flex items-center gap-1">
              <Home className="w-4 h-4" /> الرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// 👑 لوحة المالك المتقدمة
// ═══════════════════════════════════════════════════════════
function OwnerDashboard({ user, onLogout }) {
  const [clinics, setClinics] = useState([])
  const [clinicStats, setClinicStats] = useState({})
  const [showForm, setShowForm] = useState(false)
  const [editingClinic, setEditingClinic] = useState(null)
  const [stats, setStats] = useState({ total: 0, active: 0, trial: 0, expired: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('clinics').select('*').order('created_at', { ascending: false })
    setClinics(data || [])
    setStats({
      total: data?.length || 0,
      active: data?.filter(c => c.subscription_status === 'active').length || 0,
      trial: data?.filter(c => c.subscription_status === 'trial').length || 0,
      expired: data?.filter(c => c.subscription_status === 'expired').length || 0,
    })

    // تحميل إحصائيات كل عيادة
    if (data && data.length > 0) {
      const statsObj = {}
      await Promise.all(data.map(async (c) => {
        const [p, d, a, comp] = await Promise.all([
          supabase.from('patients').select('id', { count: 'exact', head: true }).eq('clinic_id', c.id),
          supabase.from('doctors').select('id', { count: 'exact', head: true }).eq('clinic_id', c.id),
          supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('clinic_id', c.id),
          supabase.from('complaints').select('id', { count: 'exact', head: true }).eq('clinic_id', c.id).eq('status', 'open'),
        ])
        statsObj[c.id] = {
          patients: p.count || 0,
          doctors: d.count || 0,
          appointments: a.count || 0,
          openComplaints: comp.count || 0,
        }
      }))
      setClinicStats(statsObj)
    }

    setLoading(false)
  }

  const deleteClinic = async (id) => {
    if (!confirm('⚠️ هل تريد حذف هذه العيادة وكل بياناتها؟ لا يمكن التراجع!')) return
    await supabase.from('clinics').delete().eq('id', id)
    load()
  }

  const updateStatus = async (id, status) => {
    await supabase.from('clinics').update({ subscription_status: status }).eq('id', id)
    load()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-yellow-50 page-enter" dir="rtl">
      <header className="bg-gradient-to-r from-gray-900 via-yellow-700 to-orange-800 shadow-2xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Crown className="w-6 h-6 text-yellow-300" />
              </div>
              <div>
                <h1 className="text-white font-black text-xl">👑 لوحة المالك</h1>
                <p className="text-yellow-200/80 text-xs">{user.full_name || user.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition text-sm">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">الرئيسية</span>
              </Link>
              <button onClick={onLogout} className="bg-white/10 hover:bg-red-500/40 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-bold">خروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* الإحصائيات الرئيسية */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <OwnerStat icon="🏥" label="إجمالي العيادات" value={stats.total} gradient="from-indigo-500 to-purple-600" />
          <OwnerStat icon="✅" label="نشطة" value={stats.active} gradient="from-green-500 to-emerald-600" />
          <OwnerStat icon="🕐" label="تجريبية" value={stats.trial} gradient="from-yellow-500 to-orange-600" />
          <OwnerStat icon="❌" label="منتهية" value={stats.expired} gradient="from-red-500 to-pink-600" />
        </div>

        {/* أزرار */}
        <div className="flex justify-end">
          <button onClick={() => { setShowForm(!showForm); setEditingClinic(null) }}
            className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl btn-glow flex items-center gap-2">
            <Plus className="w-5 h-5" /> {showForm ? 'إلغاء' : 'عيادة جديدة'}
          </button>
        </div>

        {/* فورم إضافة/تعديل */}
        {showForm && (
          <ClinicForm
            clinic={editingClinic}
            onSuccess={() => { setShowForm(false); setEditingClinic(null); load() }}
            onCancel={() => { setShowForm(false); setEditingClinic(null) }}
          />
        )}

        {/* قائمة العيادات */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-16 h-16 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin"></div>
            </div>
          ) : clinics.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-xl">
              <div className="text-6xl mb-3">🏥</div>
              <p className="text-gray-600 font-bold text-lg">لا توجد عيادات بعد</p>
              <p className="text-gray-500 text-sm mt-1">ابدأ بإضافة أول عيادة</p>
            </div>
          ) : clinics.map(clinic => (
            <ClinicCard
              key={clinic.id}
              clinic={clinic}
              stats={clinicStats[clinic.id] || {}}
              onDelete={() => deleteClinic(clinic.id)}
              onEdit={() => { setEditingClinic(clinic); setShowForm(true); window.scrollTo({top: 0, behavior: 'smooth'}) }}
              onStatusChange={(status) => updateStatus(clinic.id, status)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function OwnerStat({ icon, label, value, gradient }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} text-white rounded-3xl p-6 shadow-xl card-hover`}>
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-4xl font-black">{value}</p>
      <p className="text-white/80 text-sm font-medium mt-1">{label}</p>
    </div>
  )
}

function ClinicCard({ clinic, stats, onDelete, onEdit, onStatusChange }) {
  const [copied, setCopied] = useState(false)

  const clinicUrl = `${window.location.origin}/${clinic.slug}`
  const staffUrl = `${window.location.origin}/${clinic.slug}/staff`

  const copyLink = (link) => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl card-hover">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg flex-shrink-0"
            style={{background: `linear-gradient(135deg, ${clinic.primary_color || '#6366F1'}, ${clinic.primary_color || '#8B5CF6'}dd)`}}>
            🏥
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-2xl font-black text-gray-800">{clinic.name}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${clinic.subscription_status === 'active' ? 'bg-green-100 text-green-700' : clinic.subscription_status === 'trial' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                {clinic.subscription_status === 'active' ? '✅ نشط' : clinic.subscription_status === 'trial' ? '🕐 تجريبي' : '❌ منتهي'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-2">🔗 {clinic.slug}</p>

            <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-700">
              {clinic.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {clinic.phone}</div>}
              {clinic.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> {clinic.email}</div>}
              {clinic.address && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {clinic.address}</div>}
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /> {new Date(clinic.created_at).toLocaleDateString('ar-EG')}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 min-w-[160px]">
          <select value={clinic.subscription_status} onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-2 border-2 border-gray-200 rounded-xl text-sm font-bold focus:border-indigo-500 outline-none">
            <option value="trial">🕐 تجريبي</option>
            <option value="active">✅ نشط</option>
            <option value="expired">❌ منتهي</option>
          </select>
          <div className="flex gap-2">
            <button onClick={onEdit} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-1">
              <Edit className="w-4 h-4" /> تعديل
            </button>
            <button onClick={onDelete} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-1">
              <Trash2 className="w-4 h-4" /> حذف
            </button>
          </div>
        </div>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 pt-5 border-t border-gray-100">
        <MiniStat icon="👥" label="مرضى" value={stats.patients || 0} color="text-blue-600" />
        <MiniStat icon="👨‍⚕️" label="أطباء" value={stats.doctors || 0} color="text-green-600" />
        <MiniStat icon="📅" label="مواعيد" value={stats.appointments || 0} color="text-purple-600" />
        <MiniStat icon="⚠️" label="شكاوى" value={stats.openComplaints || 0} color="text-orange-600" />
      </div>

      {/* الروابط */}
      <div className="pt-5 border-t border-gray-100 space-y-2">
        <p className="text-xs font-bold text-gray-500 mb-2">🔗 روابط الوصول:</p>

        <LinkRow label="👤 رابط المريض" url={clinicUrl} onCopy={() => copyLink(clinicUrl)} copied={copied} />
        <LinkRow label="⚙️👨‍⚕️ رابط الموظفين" url={staffUrl} onCopy={() => copyLink(staffUrl)} copied={copied} />
      </div>
    </div>
  )
}

function MiniStat({ icon, label, value, color }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-3 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className="text-xs text-gray-600 font-medium">{label}</p>
    </div>
  )
}

function LinkRow({ label, url, onCopy, copied }) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2 flex-wrap">
      <span className="text-sm font-bold text-gray-700 min-w-[140px]">{label}</span>
      <code className="flex-1 text-xs text-gray-600 bg-white px-2 py-1 rounded truncate min-w-[200px]">{url}</code>
      <button onClick={onCopy} className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 p-2 rounded-lg" title="نسخ">
        {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
      </button>
      <a href={url} target="_blank" rel="noopener noreferrer" className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg" title="فتح">
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// 📝 فورم إضافة/تعديل العيادة
// ═══════════════════════════════════════════════════════════
function ClinicForm({ clinic, onSuccess, onCancel }) {
  const isEditing = !!clinic
  const [form, setForm] = useState({
    name: clinic?.name || '',
    slug: clinic?.slug || '',
    phone: clinic?.phone || '',
    whatsapp: clinic?.whatsapp || '',
    email: clinic?.email || '',
    address: clinic?.address || '',
    primary_color: clinic?.primary_color || '#6366F1',
    subscription_status: clinic?.subscription_status || 'trial',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // توليد الـ slug تلقائياً من الاسم
  const generateSlug = (name) => {
    const transliterate = name
      .toLowerCase()
      .replace(/[\u0600-\u06FF]/g, c => {
        const map = {'ا':'a','ب':'b','ت':'t','ث':'th','ج':'g','ح':'h','خ':'kh','د':'d','ذ':'th','ر':'r','ز':'z','س':'s','ش':'sh','ص':'s','ض':'d','ط':'t','ظ':'z','ع':'a','غ':'gh','ف':'f','ق':'q','ك':'k','ل':'l','م':'m','ن':'n','ه':'h','و':'w','ي':'y','ة':'h','ى':'a','ء':'','أ':'a','إ':'a','آ':'a','ؤ':'o','ئ':'e'}
        return map[c] || ''
      })
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 30)
    return transliterate + '-' + Math.random().toString(36).substring(2, 5)
  }

  const handleNameChange = (name) => {
    setForm(prev => ({
      ...prev,
      name,
      slug: !isEditing && !prev.slug ? generateSlug(name) : prev.slug
    }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isEditing) {
        const { error: err } = await supabase
          .from('clinics').update(form).eq('id', clinic.id)
        if (err) throw err
        onSuccess()
      } else {
        // إنشاء جديد
        const { data: newClinic, error: err } = await supabase
          .from('clinics').insert([form]).select().single()
        if (err) throw err

        // إنشاء أدمن افتراضي
        await supabase.from('admin_users').insert([{
          clinic_id: newClinic.id,
          username: 'admin',
          password: 'admin123',
          full_name: 'مدير العيادة',
          role: 'clinic_admin'
        }])

        // إنشاء دكتور افتراضي
        await supabase.from('doctors').insert([{
          clinic_id: newClinic.id,
          name: 'د. مثال',
          specialization: 'عام',
          username: 'doctor',
          password: '123456'
        }])

        onSuccess()
        alert(`✅ تم إنشاء العيادة بنجاح!\n\n🔗 رابط العيادة:\n${window.location.origin}/${newClinic.slug}\n\n🔐 بيانات الدخول الافتراضية:\n⚙️ admin / admin123\n👨‍⚕️ doctor / 123456`)
      }
    } catch (err) {
      console.error(err)
      setError('❌ ' + (err.message || 'حصل خطأ'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl animate-slide-up border-2 border-yellow-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          {isEditing ? 'تعديل العيادة' : 'إضافة عيادة جديدة'}
        </h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1">اسم العيادة *</label>
          <input required value={form.name} onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1">🔗 الرابط (slug) - رابط العيادة *</label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm whitespace-nowrap">{window.location.origin}/</span>
            <input required value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
              placeholder="smile-clinic"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none font-mono" />
          </div>
          <p className="text-xs text-gray-500 mt-1">حروف إنجليزية صغيرة وأرقام وشرطات فقط</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">📞 رقم الهاتف</label>
          <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">📱 واتساب</label>
          <input value={form.whatsapp} onChange={(e) => setForm({...form, whatsapp: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">📧 البريد الإلكتروني</label>
          <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">🎨 اللون الأساسي</label>
          <div className="flex items-center gap-2 px-3 py-2 border-2 border-gray-200 rounded-xl">
            <input type="color" value={form.primary_color} onChange={(e) => setForm({...form, primary_color: e.target.value})}
              className="w-12 h-10 rounded cursor-pointer" />
            <input value={form.primary_color} onChange={(e) => setForm({...form, primary_color: e.target.value})}
              className="flex-1 outline-none font-mono text-sm" />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1">📍 العنوان</label>
          <input value={form.address} onChange={(e) => setForm({...form, address: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none" />
        </div>

        {isEditing && (
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-1">💎 حالة الاشتراك</label>
            <select value={form.subscription_status} onChange={(e) => setForm({...form, subscription_status: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 outline-none">
              <option value="trial">🕐 تجريبي</option>
              <option value="active">✅ نشط</option>
              <option value="expired">❌ منتهي</option>
            </select>
          </div>
        )}

        {error && (
          <div className="md:col-span-2 bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-2xl text-sm font-medium animate-fade-in">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="md:col-span-2 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl font-bold shadow-xl btn-glow disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? '⏳ جاري الحفظ...' : isEditing ? <><Save className="w-5 h-5" /> حفظ التعديلات</> : <><Sparkles className="w-5 h-5" /> إنشاء العيادة</>}
        </button>
      </form>
    </div>
  )
}
