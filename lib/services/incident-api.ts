import type { IncidentReport, IncidentStatus } from '@/types/incident'

export interface SubmitResult {
  remoteId: string
  status: IncidentStatus
}

/** Contrato del backend de reportes. Reemplazar el mock por llamadas HTTP reales. */
export interface IncidentApi {
  submit(report: IncidentReport): Promise<SubmitResult>
  getStatus(remoteId: string, report: IncidentReport): Promise<IncidentStatus>
}

const MINUTE = 60_000

/**
 * Mock que simula latencia y el avance de estados en el tiempo, para que
 * la pantalla "Mis reportes" muestre todo el ciclo de vida.
 */
export function createMockIncidentApi(): IncidentApi {
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  return {
    async submit(report) {
      await wait(800)
      return { remoteId: `JAC-${report.id.slice(0, 8).toUpperCase()}`, status: 'enviado' }
    },
    async getStatus(_remoteId, report) {
      const age = Date.now() - new Date(report.createdAt).getTime()
      if (age > 60 * MINUTE) return 'cerrado'
      if (age > 2 * MINUTE) return 'en_atencion'
      return 'enviado'
    },
  }
}
