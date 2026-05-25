import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Building2, Crown, ArrowLeft, Sparkles, Search, MapPin, Phone } from 'lucide-react'

export default function HomePage() {
  const [clinics, setClinics] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadClinics()
  }, [])

  const loadClinics = async () => {
    const { data } = await supabase
      .from('clinics')
      .select('*')
      .eq('is_active', true)
      .order('name')
    setClinics(data || [])
    setLoading(false)
  }

  const filtered = clinics.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.address?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* خلفية متحركة */}
      <div className="fixed inset-0 gradient-bg-animated -z-10"></div>
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="floating-shape w-96 h-96 bg-purple-300 top-10 -right-20"></div>
        <div className="floating-shape w-80 h-80 bg-pink-300 bottom-20 -left-20" style={{animationDelay: '2s'}}></div>
        <div className="floating-shape w-72 h-72 bg-blue-300 top-1/2 left-1/3" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center p-4 page-enter">
        {/* Logo & Title */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-block mb-6 relative">
            <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl"></div>
            <div className="relative w-32 h-32 mx-auto bg-white rounded-3xl shadow-2xl flex items-center justify-center text-8xl animate-float">
              🦷
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-3 drop-shadow-lg">
            عيادات الأسنان
          </h1>
          <p className="text-white/90 text-xl font-medium">
            اختر عيادتك للدخول
          </p>
          <div className="flex items-center justify-center gap-2 mt-3 text-white/80">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">نظام إدارة العيادات الذكي</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-2xl mb-6 animate-slide-up">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 ابحث عن اسم العيادة..."
              className="w-full pr-12 pl-4 py-4 bg-white/95 backdrop-blur rounded-2xl text-gray-800 text-right focus:outline-none focus:ring-4 focus:ring-white/30 font-medium shadow-2xl"
            />
          </div>
        </div>

        {/* Clinics Grid */}
        <div className="w-full max-w-6xl animate-slide-up">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              <p className="text-white mt-4 font-medium">جاري التحميل...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 glass rounded-3xl p-12">
              <div className="text-7xl mb-4">🏥</div>
              <p className="text-gray-700 font-bold text-xl">
                {clinics.length === 0 ? 'لا توجد عيادات مسجلة بعد' : 'لا توجد نتائج للبحث'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((clinic) => (
                <Link
                  key={clinic.id}
                  to={`/${clinic.slug}`}
                  className="glass rounded-3xl p-6 card-hover group block"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg flex-shrink-0 group-hover:scale-110 transition"
                      style={{
                        background: `linear-gradient(135deg, ${clinic.primary_color || '#6366F1'}, ${clinic.primary_color || '#8B5CF6'}dd)`
                      }}
                    >
                      🏥
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">{clinic.name}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        clinic.subscription_status === 'active' ? 'bg-green-100 text-green-700' :
                        clinic.subscription_status === 'trial' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {clinic.subscription_status === 'active' ? '✅ نشطة' :
                         clinic.subscription_status === 'trial' ? '🕐 تجريبية' : '❌ منتهية'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    {clinic.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{clinic.address}</span>
                      </div>
                    )}
                    {clinic.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>{clinic.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-sm text-gray-500">دخول العيادة</span>
                    <ArrowLeft className="w-5 h-5 text-indigo-600 group-hover:-translate-x-1 transition" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Owner Link */}
        <div className="mt-10 text-center">
          <Link
            to="/owner"
            className="inline-flex items-center gap-2 glass-dark text-white px-6 py-3 rounded-2xl font-bold hover:bg-yellow-500/20 transition group"
          >
            <Crown className="w-5 h-5 text-yellow-400" />
            <span>دخول المالك</span>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-white/60 text-sm mt-8">🔒 جميع البيانات محمية ومشفّرة</p>
      </div>
    </div>
  )
}
