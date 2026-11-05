import type { IncidentApi } from './incident-api.ts'

interface MockOptions {
  latencyMs?: number
  /** Cuando se define, `submit` falla con este error. */
  failWith?: Error
}

/** API en memoria para pruebas: registra cada envío recibido. */
export function createMockIncidentApi({ latencyMs = 0, failWith }: MockOptions = {}) {
  const submittedIds: string[] = []
  const api: IncidentApi = {
    async submit(report) {
      if (latencyMs > 0) await new Promise((resolve) => setTimeout(resolve, latencyMs))
      if (failWith) throw failWith
      submittedIds.push(report.id)
      return { remoteId: `JAC-${report.id.slice(0, 8).toUpperCase()}`, status: 'enviado' }
    },
    async getStatus(_remoteId, report) {
      return report.status
    },
  }
  return { api, submittedIds }
}
