'use client'

import { useCallback, useEffect, useState } from 'react'

const PREFIX = 'jac-el-castillo:'

/**
 * Estado que se guarda en el dispositivo (localStorage). Se usa solo para
 * preferencias y avances personales, como el checklist del kit.
 */
export function usePersistedState<T>(key: string, initialValue: T) {
  const storageKey = PREFIX + key
  const [value, setValue] = useState<T>(initialValue)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey)
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is read after hydration to avoid a mismatch
      if (stored !== null) setValue(JSON.parse(stored) as T)
    } catch {
      // Almacenamiento no disponible (modo privado): se usa el valor inicial.
    }
    setIsLoaded(true)
  }, [storageKey])

  const update = useCallback(
    (next: T | ((previous: T) => T)) => {
      setValue((previous) => {
        const resolved = next instanceof Function ? next(previous) : next
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(resolved))
        } catch {
          // Sin espacio o sin permiso: el avance vive solo en esta sesión.
        }
        return resolved
      })
    },
    [storageKey],
  )

  return [value, update, isLoaded] as const
}
