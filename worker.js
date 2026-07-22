const RESTAURANT_ORIGIN = 'https://sulalah-menu.nvrgvup205.workers.dev'

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

const FORWARD_REQ_HEADERS = [
  'accept',
  'accept-language',
  'accept-encoding',
  'content-type',
  'rsc',
  'next-router-state-tree',
  'next-router-prefetch',
  'next-router-segment-prefetch',
  'next-url',
  'priority',
]

function shouldProxyRestaurants(pathname) {
  return (
    pathname === '/signup' ||
    pathname === '/signup/' ||
    pathname.startsWith('/signup/') ||
    pathname.startsWith('/_next/')
  )
}

function buildUpstreamHeaders(request) {
  const headers = new Headers()
  for (const name of FORWARD_REQ_HEADERS) {
    const value = request.headers.get(name)
    if (value) headers.set(name, value)
  }
  headers.set('user-agent', request.headers.get('user-agent') || 'sauditrend-hub')
  return headers
}

function buildResponseHeaders(upstream) {
  const headers = new Headers(upstream.headers)
  headers.delete('content-security-policy')
  headers.delete('content-security-policy-report-only')
  headers.delete('content-encoding')
  headers.delete('content-length')
  headers.set('cache-control', upstream.headers.get('cache-control') || 'public, max-age=60')
  return headers
}

async function proxyRestaurants(request, url) {
  const upstreamUrl = RESTAURANT_ORIGIN + url.pathname + url.search
  const init = {
    method: request.method,
    headers: buildUpstreamHeaders(request),
    redirect: 'follow',
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body
  }

  const upstream = await fetch(upstreamUrl, init)
  const headers = buildResponseHeaders(upstream)
  const contentType = upstream.headers.get('content-type') || ''

  // Keep relative /_next + /signup asset URLs so the browser stays same-origin.
  // Inject hub font/anti-blur only into HTML documents.
  if (contentType.includes('text/html')) {
    const rewriter = new HTMLRewriter().on('head', {
      element(el) {
        el.append(NO_BLUR_STYLE, { html: true })
      },
    })
    return rewriter.transform(new Response(upstream.body, {
      status: upstream.status,
      headers,
    }))
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // Hub entry stays /restaurants, but Next.js must run under /signup.
    if (url.pathname === '/restaurants' || url.pathname === '/restaurants/') {
      const target = new URL('/signup', url.origin)
      target.search = url.search
      return Response.redirect(target, 302)
    }

    if (shouldProxyRestaurants(url.pathname)) {
      return proxyRestaurants(request, url)
    }

    if (env.ASSETS) return env.ASSETS.fetch(request)
    return new Response('Not found', { status: 404 })
  },
}
