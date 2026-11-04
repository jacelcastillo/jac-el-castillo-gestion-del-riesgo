import type { IncidentRepository } from '@/lib/repositories/incident-repository'
import type { IncidentDraft, IncidentReport } from '@/types/incident'
import type { IncidentApi } from './incident-api'

export interface IncidentService {
  /** Guarda localmente y, si hay conexión, intenta enviarlo de una vez. */
  create(draft: IncidentDraft): Promise<IncidentReport>
  list(): Promise<IncidentReport[]>
  /** Envía todos los reportes pendientes. Devuelve cuántos se enviaron. */
  syncPending(): Promise<number>
  /** Consulta el estado de los reportes ya enviados. */
  refreshStatuses(): Promise<void>
  subscribe(listener: () => void): () => void
}

const isOnline = () => typeof navigator === 'undefined' || navigator.onLine

export function createIncidentService(
  repository: IncidentRepository,
  api: IncidentApi,
): IncidentService {
  const listeners = new Set<() => void>()
  const notify = () => listeners.forEach((listener) => listener())
  let syncing: Promise<number> | null = null

  async function trySubmit(report: IncidentReport): Promise<IncidentReport> {
    try {
      const result = await api.submit(report)
      return (
        (await repository.update(report.id, {
          status: result.status,
          remoteId: result.remoteId,
          lastSyncError: undefined,
        })) ?? report
      )
    } catch (error) {
      await repository.update(report.id, {
        lastSyncError: error instanceof Error ? error.message : String(error),
      })
      return report
    }
  }

  async function runSync(): Promise<number> {
    if (!isOnline()) return 0
    const pending = await repository.getByStatus('pendiente')
    let sent = 0
    for (const report of pending) {
      const result = await trySubmit(report)
      if (result.status !== 'pendiente') sent++
    }
    if (sent > 0) notify()
    return sent
  }

  return {
    async create(draft) {
      const now = new Date().toISOString()
      const report: IncidentReport = {
        ...draft,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        status: 'pendiente',
      }
      await repository.save(report)
      const result = isOnline() ? await trySubmit(report) : report
      notify()
      return result
    },
    list() {
      return repository.getAll()
    },
    syncPending() {
      // Evita envíos duplicados si se dispara la sincronización varias veces.
      syncing ??= runSync().finally(() => {
        syncing = null
      })
      return syncing
    },
    async refreshStatuses() {
      if (!isOnline()) return
      const all = await repository.getAll()
      let changed = false
      for (const report of all) {
        if (!report.remoteId || report.status === 'cerrado') continue
        const status = await api.getStatus(report.remoteId, report)
        if (status !== report.status) {
          await repository.update(report.id, { status })
          changed = true
        }
      }
      if (changed) notify()
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}
