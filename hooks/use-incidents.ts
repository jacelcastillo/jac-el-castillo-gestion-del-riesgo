'use client'

import { useCallback, useEffect, useState } from 'react'
import { getIncidentService } from '@/lib/services'
import type { IncidentReport } from '@/types/incident'

/** Lee los reportes del dispositivo y se actualiza cuando el servicio cambia. */
export function useIncidents() {
  const [reports, setReports] = useState<IncidentReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  const reload = useCallback(async () => {
    const list = await getIncidentService().list()
    setReports(list)
    setIsLoading(false)
  }, [])

  const sync = useCallback(async () => {
    setIsSyncing(true)
    try {
      const service = getIncidentService()
      await service.syncPending()
      await service.refreshStatuses()
      await reload()
    } finally {
      setIsSyncing(false)
    }
  }, [reload])

  useEffect(() => {
    const unsubscribe = getIncidentService().subscribe(reload)
    void sync()
    return unsubscribe
  }, [reload, sync])

  const pendingCount = reports.filter((report) => report.status === 'pendiente').length

  return { reports, isLoading, isSyncing, pendingCount, sync }
}
