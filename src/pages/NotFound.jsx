import { Link } from 'react-router-dom'
import { Home, Stethoscope } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden gradient-bg-medical flex items-center justify-center p-4">
      <div className="glass rounded-3xl p-12 max-w-md w-full text-center shadow-2xl">
        <div className="w-24 h-24 mx-auto mb-4 gradient-medical rounded-3xl flex items-center justify-center animate-float">
          <Stethoscope className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-7xl font-black text-gradient-medical mb-2">404</h1>
        <p className="text-slate-600 mb-8 text-lg font-medium">الصفحة غير موجودة</p>
        <Link to="/" className="inline-flex items-center gap-2 gradient-medical text-white px-6 py-3 rounded-2xl font-bold shadow-xl btn-medical">
          <Home className="w-5 h-5" />
          <span>الرئيسية</span>
        </Link>
      </div>
    </div>
  )
}
