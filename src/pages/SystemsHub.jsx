const portals = [
  {
    key: 'restaurants',
    kicker: 'RESTAURANTS',
    title: 'المطاعم',
    desc: 'تشغيل المطاعم والكافيهات من لوحة واحدة.',
    href: '/restaurants',
    accent: '#e3a35a',
  },
  {
    key: 'clinics',
    kicker: 'CLINICS',
    title: 'العيادات',
    desc: 'إدارة عيادات الأسنان والمواعيد والملفات الطبية.',
    href: '/dental',
    accent: '#4db7e8',
  },
  {
    key: 'gyms',
    kicker: 'GYMS',
    title: 'النوادي الرياضية',
    desc: 'اشتراكات الأعضاء والجداول والتشغيل اليومي للنادي.',
    href: 'https://gym-saas.nvrgvup205.workers.dev/',
    accent: '#4ade80',
  },
  {
    key: 'research',
    kicker: 'FIELD RESEARCH',
    title: 'الأبحاث الميدانية',
    desc: 'نظام الباحث الميداني وتجميع التقارير.',
    href: 'https://data-collections.nvrgvup205.workers.dev/',
    accent: '#c4b5fd',
  },
]

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px] transition-transform duration-250 group-hover/portal:-translate-x-1">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

export default function SystemsHub() {
  return (
    <div className="hub-root min-h-dvh relative overflow-hidden" dir="rtl">
      <div className="hub-grain" aria-hidden="true" />

      <main className="relative z-10 w-[min(1120px,calc(100%-2rem))] mx-auto min-h-dvh flex flex-col justify-center gap-[clamp(2rem,4vh,3rem)] py-[clamp(2rem,6vh,4.5rem)]">
        <header className="text-center hub-rise">
          <img
            src="/hub/assets/saudi-trend-logo.webp"
            alt="شعار سعودي ترند"
            width="96"
            height="96"
            className="w-[clamp(72px,12vw,96px)] h-auto mx-auto mb-4 drop-shadow-[0_10px_30px_rgba(212,168,75,0.25)] hub-float"
          />
          <h1 className="font-[Cairo,sans-serif] font-black text-[clamp(2rem,5.5vw,3.4rem)] leading-[1.15] tracking-tight hub-title">
            حلول سعودي ترند
          </h1>
          <p className="mt-3.5 mx-auto max-w-[34rem] text-[clamp(1rem,2.2vw,1.2rem)] leading-relaxed text-[#f4efe4b8] font-medium">
            أنظمة تشغيل داخلية تجمع المطاعم والعيادات والنوادي الرياضية والأبحاث الميدانية في بوابة واحدة.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 hub-rise-delay" aria-label="بوابات الأنظمة">
          {portals.map((p) => (
            <a
              key={p.key}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="portal-card group/portal relative flex flex-col justify-end min-h-[168px] p-[1.35rem_1.4rem_1.25rem] no-underline text-[#f4efe4] rounded-[1.35rem] overflow-hidden transition-all duration-300 hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none"
              style={{ '--accent': p.accent }}
            >
              <div className="relative text-[0.8rem] tracking-[0.08em] font-bold mb-1.5" style={{ color: `color-mix(in srgb, ${p.accent} 80%, white)` }}>
                {p.kicker}
              </div>
              <h2 className="relative font-[Cairo,sans-serif] text-[clamp(1.35rem,3vw,1.7rem)] font-extrabold mb-1.5">{p.title}</h2>
              <span className="relative text-[#f4efe4b8] text-[0.95rem] leading-relaxed">{p.desc}</span>
              <div className="relative mt-4 inline-flex items-center gap-1.5 font-bold text-[0.92rem] text-[#f0d18a]">
                دخول البوابة
                <ArrowIcon />
              </div>
            </a>
          ))}
        </section>

        <p className="text-center text-[0.85rem] text-[#f4efe473] hub-rise-late">
          سعودي ترند — بوابة الأنظمة الداخلية
        </p>
      </main>
    </div>
  )
}
