import 'server-only'

const TIMEOUT_MS = 15_000

export async function wpJson(path: string): Promise<unknown> {
  const base = process.env.WP_URL
  if (!base) throw new Error('WP_URL is not set')

  const res = await fetch(new URL(path, base), {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    // The first visit after expiry still gets the stale copy, so 30 s keeps a new alert under a minute.
    next: { revalidate: 30, tags: ['gestion-riesgo'] },
  })
  const type = res.headers.get('content-type') ?? ''
  if (!res.ok || !type.includes('json')) {
    throw new Error(`WordPress answered ${res.status} ${type || 'without content type'} for ${path}`)
  }
  return res.json()
}
