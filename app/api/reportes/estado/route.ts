import { NextResponse } from 'next/server'
import { z } from 'zod'
import { readLimitedBody } from '@/lib/server/read-limited-body'
import { fetchStatuses } from '@/lib/server/wp-reports'

const MAX_BODY_BYTES = 8 * 1024

const requestSchema = z.object({ ids: z.array(z.uuid()).min(1).max(50) })

const fail = (status: number, error: string) => NextResponse.json({ error }, { status })

export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) return fail(403, 'forbidden')
  if (!(request.headers.get('content-type') ?? '').toLowerCase().includes('json')) return fail(400, 'invalid_request')

  const bytes = await readLimitedBody(request, MAX_BODY_BYTES)
  if (bytes === null) return fail(413, 'payload_too_large')

  let body: unknown
  try {
    body = JSON.parse(new TextDecoder().decode(bytes))
  } catch {
    return fail(400, 'invalid_request')
  }
  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) return fail(400, 'invalid_request')

  const result = await fetchStatuses(parsed.data.ids)
  if (!result.ok) return fail(result.status, result.status === 502 ? 'upstream_unavailable' : 'invalid_request')
  return NextResponse.json(result.statuses, { headers: { 'Cache-Control': 'no-store' } })
}
