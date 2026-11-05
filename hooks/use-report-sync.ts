'use client'

import { useEffect } from 'react'
import { getIncidentService } from '@/lib/services'

/** Envía los reportes pendientes y actualiza estados al abrir, al volver la conexión y al volver a la pestaña. */
export function useReportSync() {
  useEffect(() => {
    const service = getIncidentService()
    const run = () => void service.syncPending().then(() => service.refreshStatuses())
    const onVisible = () => {
      if (document.visibilityState === 'visible') run()
    }
    run()
    window.addEventListener('online', run)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener('online', run)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])
}
