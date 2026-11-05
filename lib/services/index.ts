import { createIndexedDbIncidentRepository } from '@/lib/repositories/indexeddb-incident-repository'
import { createHttpIncidentApi } from './incident-api'
import { createIncidentService, type IncidentService } from './incident-service'

/**
 * Punto único de composición. Para conectar el backend real basta con cambiar
 * las implementaciones aquí; la UI solo conoce las interfaces.
 */
let incidentServiceInstance: IncidentService | null = null

/** Solo en el navegador: depende de IndexedDB. */
export function getIncidentService(): IncidentService {
  incidentServiceInstance ??= createIncidentService(
    createIndexedDbIncidentRepository(),
    createHttpIncidentApi(),
  )
  return incidentServiceInstance
}

export type { IncidentService }
