import { reportRequestSchema, type ReportRequest } from '../validation/incident-schema.ts'

export const MAX_PHOTO_BYTES = 1.5 * 1024 * 1024

export type ReportFormResult =
  | { ok: true; report: ReportRequest; photo?: Blob }
  | { ok: false; status: 400 | 413 }

const JPEG_MAGIC = [0xff, 0xd8, 0xff]

export async function parseReportForm(form: FormData): Promise<ReportFormResult> {
  const datos = form.get('datos')
  if (typeof datos !== 'string') return { ok: false, status: 400 }

  let json: unknown
  try {
    json = JSON.parse(datos)
  } catch {
    return { ok: false, status: 400 }
  }
  const parsed = reportRequestSchema.safeParse(json)
  if (!parsed.success) return { ok: false, status: 400 }

  const foto = form.get('foto')
  if (foto === null) return { ok: true, report: parsed.data }
  if (typeof foto === 'string' || foto.type !== 'image/jpeg') return { ok: false, status: 400 }
  if (foto.size > MAX_PHOTO_BYTES) return { ok: false, status: 413 }

  const head = new Uint8Array(await foto.slice(0, JPEG_MAGIC.length).arrayBuffer())
  if (!JPEG_MAGIC.every((byte, index) => head[index] === byte)) return { ok: false, status: 400 }
  return { ok: true, report: parsed.data, photo: foto }
}
