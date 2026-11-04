'use client'

import { useCallback, useState } from 'react'
import { uiCopy } from '@/config/ui-copy'

export interface Coordinates {
  latitude: number
  longitude: number
  accuracy: number
}

type GeolocationState =
  | { status: 'idle' }
  | { status: 'locating' }
  | { status: 'success'; coords: Coordinates }
  | { status: 'error'; message: string }

const errorMessages: Record<number, string> = {
  1: uiCopy.gps.denied,
  2: uiCopy.gps.unavailable,
  3: uiCopy.gps.timeout,
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({ status: 'idle' })

  const locate = useCallback((): Promise<Coordinates | null> => {
    if (!('geolocation' in navigator)) {
      setState({ status: 'error', message: uiCopy.gps.unsupported })
      return Promise.resolve(null)
    }
    setState({ status: 'locating' })
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const result: Coordinates = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            accuracy: Math.round(coords.accuracy),
          }
          setState({ status: 'success', coords: result })
          resolve(result)
        },
        (error) => {
          setState({ status: 'error', message: errorMessages[error.code] ?? uiCopy.gps.unavailable })
          resolve(null)
        },
        { enableHighAccuracy: true, timeout: 15_000, maximumAge: 60_000 },
      )
    })
  }, [])

  return { state, locate }
}
