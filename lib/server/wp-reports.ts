import 'server-only'
import type { IncidentStatus } from '@/types/incident'
import type { ReportRequest } from '@/lib/validation/incident-schema'
import { classifyWpStatus, clientIp, isJsonContentType, mapWpStatus } from './report-mapping'

const MAX_ATTEMPTS = 3
const ATTEMPT_TIMEOUT_MS = 8_000
const RETRY_DELAY_MS = 1_500

export type ForwardResult =
  | { ok: true; remoteId: string; status: IncidentStatus }
  | { ok: false; status: 400 | 429 | 502 }

type Attempt = ForwardResult | 'retry'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function attempt(url: URL, init: RequestInit): Promise<Attempt> {
  let res: Response
  try {
    res = await fetch(url, { ...init, signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS) })
  } catch (error) {
    console.warn('WordPress report request failed', error)
    return 'retry'
  }

  const contentType = res.headers.get('content-type')
  if (!isJsonContentType(contentType)) {
    console.warn(`anti-bot: WordPress answered ${res.status} ${contentType ?? 'without content type'}`)
    return 'retry'
  }

  const kind = classifyWpStatus(res.status)
  if (kind === 'bad-request') return { ok: false, status: 400 }
  if (kind === 'rate-limited') return { ok: false, status: 429 }
  if (kind === 'misconfigured') {
    console.error(`WordPress rejected the app credentials (${res.status}). Check WP_APP_USER and WP_APP_PASSWORD.`)
    return { ok: false, status: 502 }
  }
  if (res.status !== 200 && res.status !== 201) {
    console.warn(`WordPress answered ${res.status} for a report`)
    return 'retry'
  }

  const body: unknown = await res.json().catch(() => null)
  const { id, estado } = (body ?? {}) as { id?: unknown; estado?: unknown }
  const status = mapWpStatus(estado)
  if (id === undefined || id === null || !status) {
    console.warn('WordPress answered a report with an unexpected body')
    return 'retry'
  }
  return { ok: true, remoteId: String(id), status }
}

/** WordPress dedupes by the report id, so retrying a request that may have landed is safe. */
export async function forwardReport(report: ReportRequest, photo: Blob | undefined, headers: Headers): Promise<ForwardResult> {
  const { WP_URL, WP_APP_USER, WP_APP_PASSWORD } = process.env
  if (!WP_URL || !WP_APP_USER || !WP_APP_PASSWORD) {
    console.error('WP_URL, WP_APP_USER and WP_APP_PASSWORD must be set to forward reports')
    return { ok: false, status: 502 }
  }

  const url = new URL('/wp-json/jac-gr/v1/reportes', WP_URL)
  const ip = clientIp(headers)
  const body = new FormData()
  body.append('datos', JSON.stringify(report))
  if (photo) body.append('foto', photo, 'foto.jpg')
  const init: RequestInit = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${Buffer.from(`${WP_APP_USER}:${WP_APP_PASSWORD}`).toString('base64')}`,
      ...(ip ? { 'X-GR-IP': ip } : {}),
    },
    body,
    cache: 'no-store',
  }

  for (let index = 0; index < MAX_ATTEMPTS; index++) {
    if (index > 0) await sleep(RETRY_DELAY_MS)
    const result = await attempt(url, init)
    if (result !== 'retry') return result
  }
  return { ok: false, status: 502 }
}
