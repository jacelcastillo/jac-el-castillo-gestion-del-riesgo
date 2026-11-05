'use client'

import { useCallback, useState, useSyncExternalStore } from 'react'
import { getIncidentService } from '@/lib/services'
import type { IncidentDraft, IncidentReport } from '@/types/incident'

interface Snapshot {
  reports: IncidentReport[]
  loaded: boolean
}

const EMPTY: Snapshot = { reports: [], loaded: false }
let snapshot = EMPTY

function subscribe(onChange: () => void) {
  const service = getIncidentService()
  const refresh = async () => {
    snapshot = { reports: await service.list(), loaded: true }
    onChange()
  }
  const unsubscribe = service.subscribe(() => void refresh())
  void refresh()
  return unsubscribe
}

/** Guarda un reporte en el dispositivo y lo envía de una vez si hay conexión. */
export function useCreateIncident() {
  return useCallback((draft: IncidentDraft) => getIncidentService().create(draft), [])
}

/** Lee los reportes del dispositivo; `sync` reintenta los pendientes a mano. */
export function useIncidents() {
  const { reports, loaded } = useSyncExternalStore(subscribe, () => snapshot, () => EMPTY)
  const [isSyncing, setIsSyncing] = useState(false)

  const sync = useCallback(async () => {
    setIsSyncing(true)
    try {
      const service = getIncidentService()
      await service.syncPending()
      await service.refreshStatuses()
    } finally {
      setIsSyncing(false)
    }
  }, [])

  const pendingCount = reports.filter((report) => report.status === 'pendiente').length

  return { reports, isLoading: !loaded, isSyncing, pendingCount, sync }
}
