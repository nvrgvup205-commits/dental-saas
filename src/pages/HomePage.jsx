import { Link } from 'react-router-dom'
import {
  Crown, Sparkles, Shield, Zap, Users, Calendar,
  MessageSquare, BarChart3, Phone, Mail, MapPin,
  CheckCircle, ArrowLeft, Star
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-black" dir="rtl">
      {/* خلفية ذهبية متحركة */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -right-32 w-[500px] h-[500px] rounded-full bg-yellow-500/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 -left-32 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[120px] animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full bg-orange-500/5 blur-[100px] animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Owner Crown (أيقونة صغيرة في الركن) */}
      <Link
        to="/owner"
        className="fixed top-6 left-6 z-50 w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-700/20 hover:from-yellow-500/40 hover:to-yellow-700/40 backdrop-blur-xl rounded-full border border-yellow-500/30 hover:border-yellow-400 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        title="دخول المالك"
      >
        <Crown className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition" />
      </Link>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-5xl mx-auto text-center">
            {/* Logo */}
            <div className="inline-block mb-8 relative animate-fade-in">
              <div className="absolute inset-0 bg-yellow-500/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 rounded-3xl shadow-2xl flex items-center justify-center text-7xl animate-float">
                ✨
              </div>
            </div>

            {/* Brand */}
            <div className="animate-slide-up">
              <div className="inline-block px-6 py-2 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-full mb-6 backdrop-blur-sm">
                <span className="text-yellow-400 font-bold text-sm tracking-widest">PREMIUM SOLUTIONS</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black mb-4 leading-tight">
                <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Magic
                </span>
                <span className="text-white"> </span>
                <span className="bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent">
                  Solutions
                </span>
              </h1>

              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-yellow-500"></div>
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-yellow-500"></div>
              </div>

              <p className="text-2xl md:text-3xl text-white/90 font-bold mb-3">
                أنظمة عيادات الأسنان
              </p>
              <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                حلول رقمية متكاملة لإدارة عيادات الأسنان بكفاءة وأناقة
                <br/>
                نظام SaaS احترافي مع لوحة تحكم ذكية ودعم واتساب
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-slide-up" style={{animationDelay: '0.3s'}}>
              <a
                href="#features"
                className="group bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-gray-900 font-black px-8 py-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>اكتشف مميزاتنا</span>
              </a>
              <a
                href="#contact"
                className="bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white font-bold px-8 py-4 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                <span>تواصل معنا</span>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mt-16 animate-fade-in" style={{animationDelay: '0.5s'}}>
              {[
                { num: '24/7', label: 'دعم متواصل' },
                { num: '100%', label: 'آمن ومحمي' },
                { num: '∞', label: 'حلول مبتكرة' },
              ].map((s, i) => (
                <div key={i} className="bg-gradient-to-br from-yellow-500/5 to-amber-500/5 border border-yellow-500/20 rounded-2xl p-4 backdrop-blur-sm">
                  <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">{s.num}</p>
                  <p className="text-white/60 text-sm font-medium mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-4">
                <span className="text-yellow-400 font-bold text-xs tracking-wider">المميزات</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
                <span className="bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">حلول شاملة</span>
                <br/>
                لعيادتك
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                كل ما تحتاجه لإدارة عيادتك في مكان واحد
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Users, title: 'إدارة المرضى', desc: 'نظام شامل لإدارة بيانات المرضى وملفاتهم الطبية', color: 'from-blue-500 to-cyan-500' },
                { icon: Calendar, title: 'حجز المواعيد', desc: 'تقويم ذكي مع أوقات متاحة وإشعارات تلقائية', color: 'from-purple-500 to-pink-500' },
                { icon: MessageSquare, title: 'تكامل واتساب', desc: 'إشعارات تلقائية للمرضى عبر واتساب', color: 'from-green-500 to-emerald-500' },
                { icon: BarChart3, title: 'تقارير ذكية', desc: 'إحصائيات وتقارير شاملة عن أداء العيادة', color: 'from-orange-500 to-red-500' },
                { icon: Shield, title: 'أمان عالي', desc: 'حماية كاملة لبيانات المرضى وخصوصيتهم', color: 'from-indigo-500 to-purple-500' },
                { icon: Zap, title: 'سرعة فائقة', desc: 'أداء سريع وواجهة سلسة على كل الأجهزة', color: 'from-yellow-500 to-orange-500' },
              ].map((f, i) => (
                <div key={i} className="group bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-yellow-500/40 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition`}>
                    <f.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-yellow-500/5 via-amber-500/5 to-orange-500/5 border border-yellow-500/20 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl">
              <div className="text-center mb-10">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
                  لماذا <span className="bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">Magic Solutions؟</span>
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
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
                  <div key={i} className="flex items-start gap-3 bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-gray-900" />
                    </div>
                    <p className="text-white/90 font-medium">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-block px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-4">
                <span className="text-yellow-400 font-bold text-xs tracking-wider">تواصل معنا</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
                <span className="bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">جاهز للبدء؟</span>
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                تواصل معنا الآن واحصل على عرضك الخاص
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <a
                href="https://wa.me/966500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gradient-to-br from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border border-green-500/30 hover:border-green-400/60 rounded-3xl p-6 text-center transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl group-hover:scale-110 transition">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">واتساب</h3>
                <p className="text-white/60 text-sm" dir="ltr">+966 50 000 0000</p>
              </a>

              <a
                href="tel:+966500000000"
                className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border border-blue-500/30 hover:border-blue-400/60 rounded-3xl p-6 text-center transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl group-hover:scale-110 transition">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">اتصال مباشر</h3>
                <p className="text-white/60 text-sm" dir="ltr">+966 50 000 0000</p>
              </a>

              <a
                href="mailto:info@magic-solutions.com"
                className="group bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-500/30 hover:border-purple-400/60 rounded-3xl p-6 text-center transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl group-hover:scale-110 transition">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">البريد الإلكتروني</h3>
                <p className="text-white/60 text-sm">info@magic-solutions.com</p>
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-10 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-xl flex items-center justify-center text-2xl">
                ✨
              </div>
              <div>
                <p className="text-white font-black text-lg">
                  <span className="bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">Magic Solutions</span>
                </p>
                <p className="text-white/40 text-xs">أنظمة عيادات الأسنان</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>

            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} Magic Solutions. جميع الحقوق محفوظة.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
