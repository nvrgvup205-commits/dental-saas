import { useEffect } from 'react'

/** Force a full document navigation so Cloudflare Worker can handle the path. */
export default function HardNavigate({ to }) {
  useEffect(() => {
    const key = `hard-nav:${to}`
    // Prevent reload loops if the Worker unexpectedly returns the SPA shell
    if (sessionStorage.getItem(key) === '1') {
      sessionStorage.removeItem(key)
      window.location.replace('/')
      return
    }
    sessionStorage.setItem(key, '1')
    window.location.replace(to)
  }, [to])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1f0c] text-[#f4efe4]" dir="rtl">
      <p className="text-sm opacity-70">جاري فتح صفحة المطاعم...</p>
    </div>
  )
}
