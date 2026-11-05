import type { IncidentReport, IncidentStatus } from '../../types/incident.ts'

export interface SubmitResult {
  remoteId: string
  status: IncidentStatus
}

/**
 * Contrato del backend de reportes.
 * Slice 6 reemplaza `getStatus` por un `getStatuses(ids)` por lotes.
 */
export interface IncidentApi {
  submit(report: IncidentReport): Promise<SubmitResult>
  getStatus(remoteId: string, report: IncidentReport): Promise<IncidentStatus>
}

const SUBMIT_TIMEOUT_MS = 35_000
const KNOWN_STATUSES: IncidentStatus[] = ['enviado', 'en_atencion', 'cerrado']

/** Envía por el BFF `/api/reportes`; cualquier respuesta que no sea 200 o 201 lanza. */
export function createHttpIncidentApi(): IncidentApi {
  return {
    async submit(report) {
      const { id, createdAt, type, location, description, severity, peopleAffected, contact, consent } = report
      const res = await fetch('/api/reportes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, createdAt, type, location, description, severity, peopleAffected, contact, consent }),
        signal: AbortSignal.timeout(SUBMIT_TIMEOUT_MS),
      })
      if (res.status !== 200 && res.status !== 201) throw new Error(`El servidor respondió ${res.status}`)

      const body = (await res.json().catch(() => null)) as Partial<SubmitResult> | null
      if (!body?.remoteId || !body.status || !KNOWN_STATUSES.includes(body.status)) {
        throw new Error('Respuesta inesperada del servidor')
      }
      return { remoteId: body.remoteId, status: body.status }
    },
    async getStatus(_remoteId, report) {
      return report.status
    },
  }
}
