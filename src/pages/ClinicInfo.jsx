import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  MapPin, Phone, Mail, Clock, Stethoscope, Sparkles,
  ArrowLeft, Home, Calendar, CheckCircle, Award, Star,
  MessageCircle
} from 'lucide-react'

export default function ClinicInfo() {
  const { clinicSlug } = useParams()
  const [clinic, setClinic] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [clinicSlug])

  const load = async () => {
    const { data: c } = await supabase
      .from('clinics').select('*')
      .eq('slug', clinicSlug).eq('is_active', true).maybeSingle()

    if (!c) { setLoading(false); return }
    setClinic(c)

    const [d, s] = await Promise.all([
      supabase.from('doctors').select('*').eq('clinic_id', c.id).eq('is_active', true),
      supabase.from('clinic_services').select('*').eq('clinic_id', c.id).eq('is_active', true)
    ])
    setDoctors(d.data || [])
    setServices(s.data || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg-animated">
        <div className="text-center text-white">
          <div className="inline-block w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="mt-4 font-medium">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!clinic) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg-animated p-4">
        <div className="glass rounded-3xl p-12 max-w-md w-full text-center shadow-2xl">
          <div className="text-7xl mb-4">😕</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">العيادة غير موجودة</h2>
          <Link to="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold">
            <Home className="w-5 h-5" /> الرئيسية
          </Link>
        </div>
      </div>
    )
  }

  const primary = clinic.primary_color || '#6366F1'
  const workingDaysNames = {
    sat: 'السبت', sun: 'الأحد', mon: 'الإثنين',
    tue: 'الثلاثاء', wed: 'الأربعاء', thu: 'الخميس', fri: 'الجمعة'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50" dir="rtl">
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{
        background: `linear-gradient(135deg, ${primary}, ${primary}dd, #ec4899)`
      }}>
        <div className="absolute inset-0 opacity-30">
          <div className="floating-shape w-96 h-96 bg-white top-10 -right-20"></div>
          <div className="floating-shape w-80 h-80 bg-white bottom-0 -left-20" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-12 sm:py-20">
          <Link to="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">رجوع للرئيسية</span>
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-right">
            <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center text-7xl animate-float">
              🦷
            </div>
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-3 drop-shadow-lg">
                {clinic.name}
              </h1>
              {clinic.address && (
                <p className="text-white/90 text-lg flex items-center gap-2 justify-center md:justify-start">
                  <MapPin className="w-5 h-5" /> {clinic.address}
                </p>
              )}
            </div>

            <Link to={`/${clinic.slug}`}
              className="bg-white text-gray-800 px-8 py-4 rounded-2xl font-bold shadow-2xl btn-glow flex items-center gap-2 hover:scale-105 transition">
              <Calendar className="w-5 h-5" />
              احجز موعد
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* عن العيادة */}
        {clinic.about && (
          <section className="bg-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-3xl font-black text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-indigo-600" />
              عن العيادة
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">{clinic.about}</p>
          </section>
        )}

        {/* معلومات الاتصال + ساعات العمل */}
        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <Phone className="w-6 h-6 text-indigo-600" />
              معلومات التواصل
            </h2>
            <div className="space-y-4">
              {clinic.phone && (
                <a href={`tel:${clinic.phone}`} className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-2xl transition">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500">الهاتف</p>
                    <p className="text-gray-800 font-bold">{clinic.phone}</p>
                  </div>
                </a>
              )}
              {clinic.whatsapp && (
                <a href={`https://wa.me/${clinic.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-2xl transition">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500">واتساب</p>
                    <p className="text-gray-800 font-bold">{clinic.whatsapp}</p>
                  </div>
                </a>
              )}
              {clinic.email && (
                <a href={`mailto:${clinic.email}`} className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-2xl transition">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500">البريد الإلكتروني</p>
                    <p className="text-gray-800 font-bold">{clinic.email}</p>
                  </div>
                </a>
              )}
              {clinic.address && (
                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500">العنوان</p>
                    <p className="text-gray-800 font-bold">{clinic.address}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="bg-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-indigo-600" />
              ساعات العمل
            </h2>
            <div className="space-y-2">
              {['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'].map(day => {
                const isWorkingDay = clinic.working_days?.includes(day)
                return (
                  <div key={day} className={`flex items-center justify-between p-3 rounded-xl ${isWorkingDay ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 border-2 border-gray-200'}`}>
                    <span className="font-bold text-gray-800">{workingDaysNames[day]}</span>
                    {isWorkingDay ? (
                      <span className="text-green-700 font-bold flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {clinic.working_hours_start?.substring(0,5) || '09:00'} - {clinic.working_hours_end?.substring(0,5) || '21:00'}
                      </span>
                    ) : (
                      <span className="text-red-600 font-bold">مغلق</span>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* الأطباء */}
        {doctors.length > 0 && (
          <section>
            <h2 className="text-3xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <Stethoscope className="w-7 h-7 text-indigo-600" />
              أطباؤنا المتميزون
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map(d => (
                <div key={d.id} className="bg-white rounded-3xl p-6 shadow-xl card-hover">
                  <div className="text-center mb-4">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl flex items-center justify-center text-5xl shadow-lg mb-3">
                      👨‍⚕️
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{d.name}</h3>
                    {d.specialization && (
                      <p className="text-indigo-600 font-medium mt-1 flex items-center justify-center gap-1">
                        <Award className="w-4 h-4" /> {d.specialization}
                      </p>
                    )}
                  </div>
                  {d.phone && (
                    <p className="text-sm text-gray-600 text-center flex items-center justify-center gap-2 mt-3 pt-3 border-t border-gray-100">
                      <Phone className="w-4 h-4" /> {d.phone}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* الخدمات والأسعار */}
        {services.length > 0 && (
          <section>
            <h2 className="text-3xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <Star className="w-7 h-7 text-yellow-500" />
              خدماتنا وأسعارنا
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {services.map(s => (
                <div key={s.id} className="bg-white rounded-3xl p-6 shadow-xl card-hover border-r-4"
                  style={{borderColor: primary}}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">{s.name}</h3>
                      {s.description && (
                        <p className="text-gray-600 text-sm mt-1">{s.description}</p>
                      )}
                    </div>
                    <div className="text-left ml-4">
                      <p className="text-3xl font-black" style={{color: primary}}>{s.price}</p>
                      <p className="text-xs text-gray-500 font-bold">{s.currency || 'ر.س'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 pt-3 border-t border-gray-100">
                    <Clock className="w-4 h-4" />
                    <span>{s.duration_minutes} دقيقة</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA النهائي */}
        <section className="text-white rounded-3xl p-8 sm:p-12 text-center shadow-2xl"
          style={{background: `linear-gradient(135deg, ${primary}, ${primary}dd, #ec4899)`}}>
          <div className="text-6xl mb-4 animate-float">🦷</div>
          <h2 className="text-3xl sm:text-4xl font-black mb-3">جاهز لابتسامة جديدة؟</h2>
          <p className="text-white/90 mb-6 text-lg">احجز موعدك الآن بكل سهولة</p>
          <Link to={`/${clinic.slug}`}
            className="inline-flex items-center gap-2 bg-white text-gray-800 px-8 py-4 rounded-2xl font-bold shadow-2xl btn-glow hover:scale-105 transition">
            <Calendar className="w-5 h-5" />
            احجز موعدك الآن
          </Link>
        </section>
      </div>
    </div>
  )
}
