import { NextResponse } from 'next/server'
import { forwardReport } from '@/lib/server/wp-reports'
import { readLimitedBody } from '@/lib/server/read-limited-body'
import { MAX_PHOTO_BYTES, parseReportForm } from '@/lib/server/report-form'

export const maxDuration = 30

const MAX_BODY_BYTES = MAX_PHOTO_BYTES + 32 * 1024

const fail = (status: number, error: string) => NextResponse.json({ error }, { status })

export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) return fail(403, 'forbidden')

  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.toLowerCase().startsWith('multipart/form-data')) return fail(400, 'invalid_report')

  const bytes = await readLimitedBody(request, MAX_BODY_BYTES)
  if (bytes === null) return fail(413, 'payload_too_large')

  let form: FormData
  try {
    form = await new Response(bytes as BodyInit, { headers: { 'content-type': contentType } }).formData()
  } catch {
    return fail(400, 'invalid_report')
  }
  const parsed = await parseReportForm(form)
  if (!parsed.ok) return fail(parsed.status, parsed.status === 413 ? 'payload_too_large' : 'invalid_report')

  const result = await forwardReport(parsed.report, parsed.photo, request.headers)
  if (!result.ok) return fail(result.status, result.status === 502 ? 'upstream_unavailable' : 'rejected')
  return NextResponse.json({ remoteId: result.remoteId, status: result.status })
}
