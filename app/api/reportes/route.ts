import { NextResponse } from 'next/server'
import { reportRequestSchema } from '@/lib/validation/incident-schema'
import { forwardReport } from '@/lib/server/wp-reports'

export const maxDuration = 30

const MAX_BODY_BYTES = 16 * 1024

const fail = (status: number, error: string) => NextResponse.json({ error }, { status })

/** Lee el cuerpo y corta en cuanto pasa el límite, sin confiar en Content-Length. */
async function readLimitedBody(request: Request): Promise<string | null> {
  const declared = Number(request.headers.get('content-length'))
  if (declared > MAX_BODY_BYTES || !request.body) return declared > MAX_BODY_BYTES ? null : ''

  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let received = 0
  let text = ''
  for (;;) {
    const { done, value } = await reader.read()
    if (done) return text + decoder.decode()
    received += value.byteLength
    if (received > MAX_BODY_BYTES) {
      await reader.cancel()
      return null
    }
    text += decoder.decode(value, { stream: true })
  }
}

export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) return fail(403, 'forbidden')

  const raw = await readLimitedBody(request)
  if (raw === null) return fail(413, 'payload_too_large')

  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    return fail(400, 'invalid_json')
  }
  const parsed = reportRequestSchema.safeParse(json)
  if (!parsed.success) return fail(400, 'invalid_report')

  const result = await forwardReport(parsed.data, request.headers)
  if (!result.ok) return fail(result.status, result.status === 502 ? 'upstream_unavailable' : 'rejected')
  return NextResponse.json({ remoteId: result.remoteId, status: result.status })
}
