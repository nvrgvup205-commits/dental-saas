import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  MapPin, Phone, Mail, Clock, Stethoscope, Sparkles,
  ArrowLeft, Home, Calendar, Award, Heart, MessageCircle,
  CheckCircle, Activity
} from 'lucide-react'

export default function ClinicInfo() {
  const { clinicSlug } = useParams()
  const [clinic, setClinic] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [clinicSlug])

  const load = async () => {
    const { data: c } = await supabase.from('clinics').select('*')
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
      <div className="min-h-screen flex items-center justify-center gradient-bg-medical">
        <div className="text-center text-white">
          <div className="spinner-medical w-16 h-16 mx-auto"></div>
          <p className="mt-4 font-medium">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!clinic) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg-medical p-4">
        <div className="glass rounded-3xl p-12 max-w-md w-full text-center shadow-2xl">
          <div className="text-7xl mb-4">😕</div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">العيادة غير موجودة</h2>
          <Link to="/" className="inline-flex items-center gap-2 gradient-medical text-white px-6 py-3 rounded-2xl font-bold">
            <Home className="w-5 h-5" /> الرئيسية
          </Link>
        </div>
      </div>
    )
  }

  const primary = clinic.primary_color || '#0EA5E9'
  const workingDaysNames = {
    sat: 'السبت', sun: 'الأحد', mon: 'الإثنين',
    tue: 'الثلاثاء', wed: 'الأربعاء', thu: 'الخميس', fri: 'الجمعة'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-emerald-50" dir="rtl">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd, #06B6D4)` }}>
        <div className="absolute inset-0 opacity-20">
          <div className="floating-shape w-96 h-96 bg-white top-10 -right-20"></div>
          <div className="floating-shape w-80 h-80 bg-white bottom-0 -left-20" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-12 sm:py-20">
          <Link to="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">رجوع للرئيسية</span>
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-right">
            {clinic.logo_url ? (
              <img src={clinic.logo_url} alt={clinic.name} className="w-32 h-32 bg-white rounded-3xl shadow-2xl object-cover animate-float" />
            ) : (
              <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center animate-float">
                <Stethoscope className="w-16 h-16 text-sky-600" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-3 drop-shadow-lg">{clinic.name}</h1>
              {clinic.address && (
                <p className="text-white/90 text-lg flex items-center gap-2 justify-center md:justify-start">
                  <MapPin className="w-5 h-5" /> {clinic.address}
                </p>
              )}
            </div>
            <Link to={`/${clinic.slug}`} className="bg-white text-sky-700 px-8 py-4 rounded-2xl font-bold shadow-2xl btn-medical flex items-center gap-2">
              <Calendar className="w-5 h-5" /> احجز موعد
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {clinic.about && (
          <section className="bg-white rounded-3xl p-8 shadow-xl border border-sky-100">
            <h2 className="text-3xl font-black text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-sky-600" /> عن العيادة
            </h2>
            <p className="text-slate-700 text-lg leading-relaxed">{clinic.about}</p>
          </section>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* تواصل */}
          <section className="bg-white rounded-3xl p-8 shadow-xl border border-sky-100">
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <Phone className="w-6 h-6 text-sky-600" /> معلومات التواصل
            </h2>
            <div className="space-y-3">
              {clinic.phone && <ContactCard icon={Phone} label="الهاتف" value={clinic.phone} href={`tel:${clinic.phone}`} color="from-sky-500 to-blue-500" />}
              {clinic.whatsapp && <ContactCard icon={MessageCircle} label="واتساب" value={clinic.whatsapp} href={`https://wa.me/${clinic.whatsapp.replace(/\D/g, '')}`} color="from-emerald-500 to-green-500" />}
              {clinic.email && <ContactCard icon={Mail} label="البريد" value={clinic.email} href={`mailto:${clinic.email}`} color="from-cyan-500 to-teal-500" />}
              {clinic.address && <ContactCard icon={MapPin} label="العنوان" value={clinic.address} color="from-indigo-500 to-purple-500" />}
            </div>
          </section>

          {/* ساعات العمل */}
          <section className="bg-white rounded-3xl p-8 shadow-xl border border-sky-100">
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-sky-600" /> ساعات العمل
            </h2>
            <div className="space-y-2">
              {['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'].map(day => {
                const isWorking = clinic.working_days?.includes(day)
                return (
                  <div key={day} className={`flex items-center justify-between p-3 rounded-xl border-2 ${isWorking ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="font-bold text-slate-800">{workingDaysNames[day]}</span>
                    {isWorking ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
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
            <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <Stethoscope className="w-7 h-7 text-sky-600" /> أطباؤنا
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map(d => (
                <div key={d.id} className="bg-white rounded-3xl p-6 shadow-xl border border-sky-100 card-medical text-center">
                  {d.photo_url ? (
                    <img src={d.photo_url} alt={d.name} className="w-24 h-24 mx-auto rounded-3xl shadow-lg mb-3 object-cover" />
                  ) : (
                    <div className="w-24 h-24 mx-auto gradient-medical rounded-3xl flex items-center justify-center shadow-lg mb-3">
                      <Stethoscope className="w-12 h-12 text-white" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-slate-800">{d.name}</h3>
                  {d.specialization && (
                    <p className="text-sky-600 font-medium mt-1 flex items-center justify-center gap-1">
                      <Award className="w-4 h-4" /> {d.specialization}
                    </p>
                  )}
                  {d.phone && (
                    <p className="text-sm text-slate-600 flex items-center justify-center gap-2 mt-3 pt-3 border-t border-sky-100">
                      <Phone className="w-4 h-4" /> {d.phone}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* الخدمات */}
        {services.length > 0 && (
          <section>
            <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <Activity className="w-7 h-7 text-sky-600" /> خدماتنا وأسعارنا
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {services.map(s => (
                <div key={s.id} className="bg-white rounded-3xl p-6 shadow-xl border-r-4 card-medical" style={{borderColor: primary}}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-800">{s.name}</h3>
                      {s.description && <p className="text-slate-600 text-sm mt-1">{s.description}</p>}
                    </div>
                    <div className="text-left ml-4">
                      <p className="text-3xl font-black" style={{color: primary}}>{s.price}</p>
                      <p className="text-xs text-slate-500 font-bold">{s.currency || 'ر.س'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 pt-3 border-t border-sky-100">
                    <Clock className="w-4 h-4" /> {s.duration_minutes} دقيقة
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="text-white rounded-3xl p-8 sm:p-12 text-center shadow-2xl" style={{background: `linear-gradient(135deg, ${primary}, ${primary}dd, #06B6D4)`}}>
          <Heart className="w-16 h-16 mx-auto mb-4 animate-float fill-white/20" />
          <h2 className="text-3xl sm:text-4xl font-black mb-3">جاهز لابتسامة جديدة؟</h2>
          <p className="text-white/90 mb-6 text-lg">احجز موعدك الآن بكل سهولة</p>
          <Link to={`/${clinic.slug}`} className="inline-flex items-center gap-2 bg-white text-slate-800 px-8 py-4 rounded-2xl font-bold shadow-2xl btn-medical">
            <Calendar className="w-5 h-5" /> احجز موعدك الآن
          </Link>
        </section>
      </div>
    </div>
  )
}

function ContactCard({ icon: Icon, label, value, href, color }) {
  const content = (
    <div className={`flex items-center gap-3 p-4 rounded-2xl ${href ? 'hover:bg-sky-50 cursor-pointer' : ''} transition`}>
      <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white shadow-md`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500">{label}</p>
        <p className="text-slate-800 font-bold">{value}</p>
      </div>
    </div>
  )
  return href ? <a href={href} target="_blank" rel="noopener noreferrer">{content}</a> : content
}
