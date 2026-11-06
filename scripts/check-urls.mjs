import { precachePaths } from '../lib/precache.ts'

const base = (process.argv[2] ?? 'http://localhost:3200').replace(/\/$/, '')
const origin = new URL(base).origin
const foreignOrigin = 'https://evil.example'
let fails = 0

function check(name, ok, detail = '') {
  if (!ok) fails++
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ` (${detail})` : ''}`)
}

const request = (path, options = {}) => fetch(`${base}${path}`, { redirect: 'manual', ...options })

for (const path of precachePaths()) {
  const { status } = await request(path)
  if (path === '/mapa') check('GET /mapa: 200 with points, 404 without', status === 200 || status === 404, `got ${status}, ${status === 200 ? 'has points' : 'no points'}`)
  else check(`GET ${path}: 200`, status === 200, `got ${status}`)
}

const unknownRisk = await request('/riesgos/x')
check('GET /riesgos/x: 404', unknownRisk.status === 404, `got ${unknownRisk.status}`)

const worker = await request('/sw.js')
const workerCache = worker.headers.get('cache-control') ?? ''
check('GET /sw.js: 200 with Cache-Control no-cache', worker.status === 200 && workerCache.includes('no-cache'), `got ${worker.status} "${workerCache}"`)

for (const path of ['/manifest.webmanifest', '/robots.txt']) {
  const res = await request(path)
  check(`GET ${path}: 200`, res.status === 200, `got ${res.status}`)
}

const home = await request('/')
const csp = home.headers.get('content-security-policy') ?? ''
check('/ has a CSP with worker-src', /(^|;\s*)worker-src\s/.test(csp))
check('/ has X-Content-Type-Options nosniff', home.headers.get('x-content-type-options') === 'nosniff')
check('/ has Referrer-Policy', Boolean(home.headers.get('referrer-policy')))
check('/ has Permissions-Policy', Boolean(home.headers.get('permissions-policy')))

const reportsGet = await request('/api/reportes')
check('GET /api/reportes: 405', reportsGet.status === 405, `got ${reportsGet.status}`)

const post = (path, headers, body) => request(path, { method: 'POST', headers, body })

const endpoints = [
  { path: '/api/reportes', badHeaders: { 'content-type': 'text/plain' }, badBody: 'not a report' },
  { path: '/api/reportes/estado', badHeaders: { 'content-type': 'application/json' }, badBody: '{"ids":[]}' },
]
for (const { path, badHeaders, badBody } of endpoints) {
  const foreign = await post(path, { ...badHeaders, origin: foreignOrigin }, badBody)
  check(`POST ${path} with a foreign Origin: 403`, foreign.status === 403, `got ${foreign.status}`)
  const bad = await post(path, { ...badHeaders, origin }, badBody)
  check(`POST ${path} with the right Origin and a bad body: 400`, bad.status === 400, `got ${bad.status}`)
}

console.log(`${fails ? 'FAIL' : 'OK'}: ${fails} failed`)
process.exit(fails ? 1 : 0)
