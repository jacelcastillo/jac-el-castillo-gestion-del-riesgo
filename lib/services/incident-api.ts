import { dataUrlToBlob } from '../data-url.ts'
import type { IncidentReport, IncidentStatus } from '../../types/incident.ts'

export interface SubmitResult {
  remoteId: string
  status: IncidentStatus
}

/** Contrato del backend de reportes. */
export interface IncidentApi {
  submit(report: IncidentReport): Promise<SubmitResult>
  /** Estado actual por id de reporte; los ids que el servidor no conoce no vienen en la respuesta. */
  getStatuses(reportIds: string[]): Promise<Record<string, IncidentStatus>>
}

const SUBMIT_TIMEOUT_MS = 35_000
const STATUS_TIMEOUT_MS = 15_000
const KNOWN_STATUSES: IncidentStatus[] = ['enviado', 'en_atencion', 'cerrado']

/** Envía por el BFF `/api/reportes`; cualquier respuesta que no sea 200 o 201 lanza. */
export function createHttpIncidentApi(): IncidentApi {
  return {
    async submit(report) {
      const { id, createdAt, type, location, description, severity, peopleAffected, contact, consent, photo } = report
      const form = new FormData()
      form.append('datos', JSON.stringify({ id, createdAt, type, location, description, severity, peopleAffected, contact, consent }))
      if (photo) form.append('foto', dataUrlToBlob(photo.dataUrl), 'foto.jpg')
      const res = await fetch('/api/reportes', {
        method: 'POST',
        body: form,
        signal: AbortSignal.timeout(SUBMIT_TIMEOUT_MS),
      })
      if (res.status !== 200 && res.status !== 201) throw new Error(`El servidor respondió ${res.status}`)

      const body = (await res.json().catch(() => null)) as Partial<SubmitResult> | null
      if (!body?.remoteId || !body.status || !KNOWN_STATUSES.includes(body.status)) {
        throw new Error('Respuesta inesperada del servidor')
      }
      return { remoteId: body.remoteId, status: body.status }
    },
    async getStatuses(ids) {
      const res = await fetch('/api/reportes/estado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
        signal: AbortSignal.timeout(STATUS_TIMEOUT_MS),
      })
      if (res.status !== 200) throw new Error(`El servidor respondió ${res.status}`)

      const body = (await res.json().catch(() => null)) as Record<string, unknown> | null
      const statuses: Record<string, IncidentStatus> = {}
      for (const [id, status] of Object.entries(body ?? {})) {
        if (KNOWN_STATUSES.includes(status as IncidentStatus)) statuses[id] = status as IncidentStatus
      }
      return statuses
    },
  }
}
