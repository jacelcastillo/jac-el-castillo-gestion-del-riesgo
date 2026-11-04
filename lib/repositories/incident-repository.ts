import type { IncidentReport, IncidentStatus } from '@/types/incident'

/** Persistencia de reportes. Los consumidores no conocen el almacenamiento real. */
export interface IncidentRepository {
  save(report: IncidentReport): Promise<void>
  getAll(): Promise<IncidentReport[]>
  getById(id: string): Promise<IncidentReport | undefined>
  getByStatus(status: IncidentStatus): Promise<IncidentReport[]>
  update(id: string, changes: Partial<IncidentReport>): Promise<IncidentReport | undefined>
}
