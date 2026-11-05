const VERSION = new URL(self.location).searchParams.get('v') || 'dev'
const CACHE = `gr-${VERSION}`
const NAVIGATION_TIMEOUT_MS = 4000
const MATCH = { ignoreSearch: true, ignoreVary: true }
const STATIC_PREFIXES = ['/_next/static/', '/_next/image', '/icons/', '/brand/']

const pageKey = (url) => url.origin + url.pathname
const isCacheablePage = (res) =>
  res.ok && !res.redirected && res.type === 'basic' && (res.headers.get('content-type') || '').includes('text/html')

function collectAssets(html) {
  const found = new Set()
  const add = (path) => found.add(path.replace(/&amp;/g, '&'))
  for (const match of html.matchAll(/\/_next\/static\/[^"'\s\\)<>]+/g)) add(match[0])
  for (const match of html.matchAll(/"static\/([^"\\]+)"/g)) add(`/_next/static/${match[1]}`)
  for (const match of html.matchAll(/\/_next\/image\?[^"'\s,\\<>]+/g)) add(match[0])
  return found
}

function collectFonts(css, cssUrl) {
  const fonts = new Set()
  for (const match of css.matchAll(/url\(\s*["']?([^"')\s]+)/g)) {
    if (match[1].startsWith('data:')) continue
    const url = new URL(match[1], cssUrl)
    if (url.origin === self.location.origin) fonts.add(url.pathname + url.search)
  }
  return fonts
}

async function store(cache, path) {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`${res.status} ${path}`)
  await cache.put(path, res.clone())
  return res
}

async function install() {
  const cache = await caches.open(CACHE)
  const { pages } = await (await fetch('/precache.json', { cache: 'reload' })).json()
  const assets = new Set()

  const results = await Promise.allSettled(
    pages.map(async (path) => {
      const res = await fetch(path, { cache: 'reload' })
      if (!isCacheablePage(res)) throw new Error(`not cacheable: ${path}`)
      await cache.put(pageKey(new URL(path, self.location.origin)), res.clone())
      for (const asset of collectAssets(await res.text())) assets.add(asset)
    }),
  )
  const offlineIndex = pages.indexOf('/offline')
  if (offlineIndex === -1 || results[offlineIndex].status === 'rejected') throw new Error('offline page not cached')

  const fonts = new Set()
  await Promise.allSettled(
    [...assets].map(async (path) => {
      const res = await store(cache, path)
      if (path.endsWith('.css')) for (const font of collectFonts(await res.text(), new URL(path, self.location.origin))) fonts.add(font)
    }),
  )
  await Promise.allSettled([...fonts].filter((font) => !assets.has(font)).map((font) => store(cache, font)))
}

self.addEventListener('install', (event) => {
  event.waitUntil(install().then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => name.startsWith('gr-') && name !== CACHE).map((name) => caches.delete(name))))
      .then(() => self.clients.claim()),
  )
})

async function cacheFirst(request) {
  const cache = await caches.open(CACHE)
  const cached = await cache.match(request, { ignoreVary: true })
  if (cached) return cached
  const res = await fetch(request)
  if (res.ok && res.status === 200) await cache.put(request, res.clone())
  return res
}

async function navigate(event) {
  const url = new URL(event.request.url)
  const cache = await caches.open(CACHE)
  const network = fetch(event.request).then((res) => {
    if (isCacheablePage(res)) event.waitUntil(cache.put(pageKey(url), res.clone()))
    return res
  })
  const timeout = new Promise((resolve) => setTimeout(() => resolve(null), NAVIGATION_TIMEOUT_MS))
  try {
    const res = await Promise.race([network, timeout])
    if (res) return res
    const copy = await cache.match(pageKey(url), MATCH)
    if (copy) {
      event.waitUntil(network.catch(() => {}))
      return copy
    }
    return await network
  } catch {
    return (await cache.match(pageKey(url), MATCH)) || (await cache.match(pageKey(new URL('/offline', url)), MATCH)) || Response.error()
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  if (request.method !== 'GET' || url.origin !== self.location.origin) return
  if (request.headers.has('rsc') || url.searchParams.has('_rsc') || url.pathname.startsWith('/api/')) return

  if (request.mode === 'navigate') {
    event.respondWith(navigate(event))
  } else if (STATIC_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) {
    event.respondWith(cacheFirst(request))
  }
})
