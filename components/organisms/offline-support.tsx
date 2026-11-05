'use client'

import { useEffect } from 'react'
import { uiCopy } from '@/config/ui-copy'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { useReportSync } from '@/hooks/use-report-sync'

const SW_URL = `/sw.js?v=${process.env.NEXT_PUBLIC_SW_VERSION}`

function registerWhenLoaded() {
  const register = () => void navigator.serviceWorker.register(SW_URL).catch(() => {})
  if (document.readyState === 'complete') return register()
  window.addEventListener('load', register, { once: true })
}

export function OfflineSupport() {
  const online = useOnlineStatus()
  useReportSync()

  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) registerWhenLoaded()
  }, [])

  return (
    <div role="status">
      {!online && (
        <p className="bg-caution px-4 py-2 text-center text-sm font-semibold text-caution-foreground">
          {uiCopy.offline}
        </p>
      )}
    </div>
  )
}
