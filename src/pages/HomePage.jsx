import { Link } from 'react-router-dom'
import {
  Shield, Zap, Users, Calendar, MessageSquare, BarChart3,
  Phone, Mail, CheckCircle, Stethoscope, Activity, Heart,
  Lock, Globe, Smartphone, Award, Sparkles, ArrowLeft
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-sky-50 via-cyan-50 to-emerald-50" dir="rtl">
      {/* خلفية متحركة طبية */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="floating-shape w-[500px] h-[500px] bg-sky-400/20 top-0 -right-32"></div>
        <div className="floating-shape w-[500px] h-[500px] bg-cyan-400/20 bottom-0 -left-32" style={{animationDelay: '2s'}}></div>
        <div className="floating-shape w-[400px] h-[400px] bg-emerald-400/15 top-1/2 left-1/2" style={{animationDelay: '4s'}}></div>
      </div>

      {/* رجوع لبوابة سعودي ترند */}
      <Link
        to="/"
        className="fixed top-6 right-6 z-50 px-4 py-2 bg-white/80 hover:bg-sky-100 backdrop-blur-xl rounded-full border-2 border-sky-200 hover:border-sky-400 flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg text-sky-700 font-bold text-sm"
        title="بوابة سعودي ترند"
      >
        <ArrowLeft className="w-4 h-4" />
        البوابة
      </Link>

      {/* زر المالك (تاج صغير) */}
      <Link
        to="/owner"
        className="fixed top-6 left-6 z-50 w-12 h-12 bg-white/80 hover:bg-sky-100 backdrop-blur-xl rounded-full border-2 border-sky-200 hover:border-sky-400 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg group"
        title="دخول المالك"
      >
        <Lock className="w-5 h-5 text-sky-600 group-hover:text-sky-700" />
      </Link>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block mb-8 relative animate-fade-in">
              <div className="absolute inset-0 bg-sky-400/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative w-32 h-32 mx-auto gradient-medical rounded-3xl shadow-2xl flex items-center justify-center animate-float">
                <Stethoscope className="w-16 h-16 text-white" />
              </div>
            </div>

            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/80 border-2 border-sky-200 rounded-full mb-6 backdrop-blur-sm shadow-lg">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span className="text-sky-700 font-bold text-sm tracking-widest">PREMIUM MEDICAL SOLUTIONS</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black mb-4 leading-tight">
                <span className="text-gradient-medical">Magic</span>
                <span className="text-slate-800"> </span>
                <span className="text-gradient-dark">Solutions</span>
              </h1>

              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-0.5 w-16 bg-gradient-to-r from-transparent to-sky-500"></div>
                <Heart className="w-5 h-5 text-sky-600 fill-sky-100" />
                <div className="h-0.5 w-16 bg-gradient-to-l from-transparent to-sky-500"></div>
              </div>

              <p className="text-2xl md:text-3xl text-slate-700 font-bold mb-3">
                أنظمة عيادات الأسنان
              </p>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                حلول رقمية متكاملة لإدارة عيادات الأسنان بكفاءة وأناقة
                <br/>
                نظام SaaS احترافي مع لوحة تحكم ذكية ودعم واتساب
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-slide-up" style={{animationDelay: '0.3s'}}>
              <a href="#features" className="group gradient-medical text-white font-black px-8 py-4 rounded-2xl shadow-xl btn-medical flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>اكتشف المميزات</span>
              </a>
              <a href="#contact" className="bg-white hover:bg-sky-50 text-slate-700 font-bold px-8 py-4 rounded-2xl border-2 border-sky-200 hover:border-sky-400 shadow-lg btn-medical flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                <span>تواصل معنا</span>
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mt-16 animate-fade-in" style={{animationDelay: '0.5s'}}>
              {[
                { num: '24/7', label: 'دعم متواصل', icon: Activity },
                { num: '100%', label: 'آمن ومحمي', icon: Shield },
                { num: '⚡', label: 'سريع وفعال', icon: Zap },
              ].map((s, i) => (
                <div key={i} className="bg-white/70 backdrop-blur-sm border-2 border-sky-100 rounded-2xl p-4 shadow-lg card-medical">
                  <s.icon className="w-8 h-8 mx-auto mb-2 text-sky-600" />
                  <p className="text-3xl md:text-4xl font-black text-gradient-medical">{s.num}</p>
                  <p className="text-slate-600 text-sm font-medium mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-100 border border-sky-200 rounded-full mb-4">
                <Award className="w-4 h-4 text-sky-600" />
                <span className="text-sky-700 font-bold text-xs tracking-wider">المميزات</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-3">
                <span className="text-gradient-medical">حلول شاملة</span> لعيادتك
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">كل ما تحتاجه لإدارة عيادتك في مكان واحد</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Users, title: 'إدارة المرضى', desc: 'نظام شامل لإدارة بيانات المرضى وملفاتهم الطبية', gradient: 'from-sky-500 to-blue-500' },
                { icon: Calendar, title: 'حجز المواعيد', desc: 'تقويم ذكي مع أوقات متاحة وإشعارات تلقائية', gradient: 'from-cyan-500 to-teal-500' },
                { icon: MessageSquare, title: 'تكامل واتساب', desc: 'إشعارات تلقائية للمرضى عبر واتساب', gradient: 'from-emerald-500 to-green-500' },
                { icon: BarChart3, title: 'تقارير ذكية', desc: 'إحصائيات وتقارير شاملة عن أداء العيادة', gradient: 'from-blue-500 to-indigo-500' },
                { icon: Shield, title: 'أمان عالي', desc: 'حماية كاملة لبيانات المرضى وخصوصيتهم', gradient: 'from-indigo-500 to-purple-500' },
                { icon: Smartphone, title: 'يعمل على كل الأجهزة', desc: 'موبايل، تابلت، كمبيوتر - تجربة سلسة', gradient: 'from-teal-500 to-cyan-500' },
              ].map((f, i) => (
                <div key={i} className="group bg-white/80 backdrop-blur-xl border-2 border-sky-100 hover:border-sky-300 rounded-3xl p-6 shadow-lg card-medical">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition`}>
                    <f.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{f.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Us */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/80 border-2 border-sky-200 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl shadow-2xl">
              <div className="text-center mb-10">
                <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-3">
                  لماذا <span className="text-gradient-medical">Magic Solutions؟</span>
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  'نظام احترافي مصمم خصيصاً لعيادات الأسنان',
                  'واجهة عربية كاملة وسهلة الاستخدام',
                  'لوحة تحكم متكاملة للمالك والأطباء والمرضى',
                  'تكامل مع واتساب وأنظمة الدفع',
                  'تقارير ورسوم بيانية متقدمة',
                  'تحديثات وتطوير مستمر',
                  'دعم فني على مدار الساعة',
                  'تجربة مجانية 14 يوم',
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-2xl p-4 border border-sky-100">
                    <div className="w-7 h-7 rounded-full gradient-medical flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-slate-800 font-semibold">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-100 border border-sky-200 rounded-full mb-4">
                <Phone className="w-4 h-4 text-sky-600" />
                <span className="text-sky-700 font-bold text-xs tracking-wider">تواصل معنا</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-3">
                <span className="text-gradient-medical">جاهز للبدء؟</span>
              </h2>
              <p className="text-slate-600">تواصل معنا الآن واحصل على عرضك الخاص</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: MessageSquare, label: 'واتساب', value: '+966 50 000 0000', href: 'https://wa.me/966500000000', gradient: 'from-emerald-500 to-green-600' },
                { icon: Phone, label: 'اتصال', value: '+966 50 000 0000', href: 'tel:+966500000000', gradient: 'from-sky-500 to-blue-600' },
                { icon: Mail, label: 'البريد', value: 'info@magic-solutions.com', href: 'mailto:info@magic-solutions.com', gradient: 'from-cyan-500 to-teal-600' },
              ].map((c, i) => (
                <a key={i} href={c.href} target="_blank" rel="noopener noreferrer"
                  className="group bg-white/80 border-2 border-sky-100 hover:border-sky-300 rounded-3xl p-6 text-center shadow-lg card-medical">
                  <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${c.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-xl group-hover:scale-110 transition`}>
                    <c.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-slate-800 font-bold text-lg mb-1">{c.label}</h3>
                  <p className="text-slate-600 text-sm" dir="ltr">{c.value}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-sky-200 py-10 px-4 bg-white/50">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 gradient-medical rounded-xl flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-black text-lg text-gradient-medical">Magic Solutions</p>
                <p className="text-slate-500 text-xs">أنظمة عيادات الأسنان</p>
              </div>
            </div>
            <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Magic Solutions. جميع الحقوق محفوظة.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
