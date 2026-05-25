import { Link } from 'react-router-dom'
import { Home, AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 gradient-bg-animated -z-10"></div>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass rounded-3xl p-12 max-w-md w-full text-center shadow-2xl">
          <div className="text-8xl mb-4 animate-float">🦷</div>
          <h1 className="text-6xl font-black text-gray-800 mb-2">404</h1>
          <p className="text-gray-600 mb-8 text-lg font-medium">
            الصفحة اللي بتدور عليها مش موجودة
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl btn-glow"
          >
            <Home className="w-5 h-5" />
            <span>الرجوع للرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
