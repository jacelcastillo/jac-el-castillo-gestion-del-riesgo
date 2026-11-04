import { createIndexedDbIncidentRepository } from '@/lib/repositories/indexeddb-incident-repository'
import { mockContentService, type ContentService } from './content-service'
import { createMockIncidentApi } from './incident-api'
import { createIncidentService, type IncidentService } from './incident-service'

/**
 * Punto único de composición. Para conectar el backend real basta con cambiar
 * las implementaciones aquí; la UI solo conoce las interfaces.
 */
export const contentService: ContentService = mockContentService

let incidentServiceInstance: IncidentService | null = null

/** Solo en el navegador: depende de IndexedDB. */
export function getIncidentService(): IncidentService {
  incidentServiceInstance ??= createIncidentService(
    createIndexedDbIncidentRepository(),
    createMockIncidentApi(),
  )
  return incidentServiceInstance
}

export type { ContentService, IncidentService }
