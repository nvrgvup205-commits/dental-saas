const RESTAURANT_ORIGIN = 'https://sulalah-menu.nvrgvup205.workers.dev'
const SIGNUP_PATH = '/signup'

const NO_BLUR_STYLE = `
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
<style id="st-no-text-blur">
  html, body, .signup-landing, .signup-landing * {
    font-family: "Tajawal", "Cairo", "IBM Plex Sans Arabic", sans-serif !important;
  }
  .signup-word,
  .signup-word--soft-rise,
  .signup-word--fall,
  .signup-word--drift,
  .signup-word--blur,
  .signup-word--water,
  .signup-word--hook,
  .signup-word--hook-fall,
  .signup-word--hook-water,
  .signup-word--hook-glow,
  .signup-reveal,
  .signup-reveal--fade-up,
  .signup-reveal--fade-down,
  .signup-reveal--fade-left,
  .signup-reveal--fade-right,
  .signup-reveal--scale-in,
  .signup-reveal--blur-up,
  .signup-motion-text__visible {
    filter: none !important;
    -webkit-filter: none !important;
    opacity: 1 !important;
    transform: none !important;
    text-shadow: none !important;
  }
</style>
`

function absolutize(url) {
  if (!url) return url
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//') || url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('#')) {
    return url
  }
  if (url.startsWith('/')) return RESTAURANT_ORIGIN + url
  return RESTAURANT_ORIGIN + '/' + url
}

function rewriteAttr(el, attr) {
  const value = el.getAttribute(attr)
  if (!value) return
  el.setAttribute(attr, absolutize(value))
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/restaurants' || url.pathname === '/restaurants/') {
      const upstream = await fetch(RESTAURANT_ORIGIN + SIGNUP_PATH, {
        headers: {
          Accept: request.headers.get('Accept') || 'text/html',
          'Accept-Language': request.headers.get('Accept-Language') || 'ar',
          'User-Agent': request.headers.get('User-Agent') || 'sauditrend-hub',
        },
      })

      const rewriter = new HTMLRewriter()
        .on('head', {
          element(el) {
            el.append(NO_BLUR_STYLE, { html: true })
          },
        })
        .on('img[src]', { element(el) { rewriteAttr(el, 'src') } })
        .on('script[src]', { element(el) { rewriteAttr(el, 'src') } })
        .on('link[href]', { element(el) { rewriteAttr(el, 'href') } })
        .on('a[href]', {
          element(el) {
            const href = el.getAttribute('href')
            if (!href) return
            if (href.startsWith('/') && !href.startsWith('//')) {
              el.setAttribute('href', RESTAURANT_ORIGIN + href)
            }
          },
        })
        .on('form[action]', { element(el) { rewriteAttr(el, 'action') } })
        .on('source[src]', { element(el) { rewriteAttr(el, 'src') } })
        .on('video[src]', { element(el) { rewriteAttr(el, 'src') } })
        .on('use[href]', { element(el) { rewriteAttr(el, 'href') } })

      const headers = new Headers(upstream.headers)
      headers.delete('content-security-policy')
      headers.delete('content-security-policy-report-only')
      headers.set('cache-control', 'public, max-age=60')

      return rewriter.transform(new Response(upstream.body, {
        status: upstream.status,
        headers,
      }))
    }

    // Default: static SPA assets
    if (env.ASSETS) return env.ASSETS.fetch(request)
    return new Response('Not found', { status: 404 })
  },
}
