import type { IncidentApi } from './incident-api.ts'
import type { IncidentStatus } from '../../types/incident.ts'

interface MockOptions {
  latencyMs?: number
  /** Cuando se define, `submit` falla con este error. */
  failWith?: Error
  /** Estados que devuelve `getStatuses`, por id de reporte. */
  statuses?: Record<string, IncidentStatus>
  /** Cuando se define, `getStatuses` falla con este error. */
  statusFailWith?: Error
}

/** API en memoria para pruebas: registra cada envío y cada consulta de estados. */
export function createMockIncidentApi({ latencyMs = 0, failWith, statuses = {}, statusFailWith }: MockOptions = {}) {
  const submittedIds: string[] = []
  const statusCalls: string[][] = []
  const api: IncidentApi = {
    async submit(report) {
      if (latencyMs > 0) await new Promise((resolve) => setTimeout(resolve, latencyMs))
      if (failWith) throw failWith
      submittedIds.push(report.id)
      return { remoteId: `JAC-${report.id.slice(0, 8).toUpperCase()}`, status: 'enviado' }
    },
    async getStatuses(ids) {
      statusCalls.push(ids)
      if (statusFailWith) throw statusFailWith
      return Object.fromEntries(ids.filter((id) => id in statuses).map((id) => [id, statuses[id]]))
    },
  }
  return { api, submittedIds, statusCalls, statuses }
}
