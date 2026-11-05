import type { IncidentStatus } from '../../types/incident.ts'

const STATUS_BY_WP_STATE: Record<string, IncidentStatus> = {
  recibido: 'enviado',
  en_atencion: 'en_atencion',
  cerrado: 'cerrado',
}

export function mapWpStatus(estado: unknown): IncidentStatus | undefined {
  return typeof estado === 'string' ? STATUS_BY_WP_STATE[estado] : undefined
}

export function clientIp(headers: Headers): string | undefined {
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || headers.get('x-real-ip')?.trim() || undefined
}

export const isJsonContentType = (contentType: string | null) => (contentType ?? '').toLowerCase().includes('json')

export type FailureKind = 'bad-request' | 'rate-limited' | 'misconfigured' | 'retry'

/** Un 2xx no JSON (el anti-bot del hosting) y los 5xx se reintentan. */
export function classifyWpStatus(status: number): FailureKind {
  if (status === 400) return 'bad-request'
  if (status === 429) return 'rate-limited'
  if (status === 401 || status === 403) return 'misconfigured'
  return 'retry'
}
