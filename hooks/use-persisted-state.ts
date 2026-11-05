'use client'

import { useCallback, useSyncExternalStore } from 'react'

const PREFIX = 'jac-el-castillo:'

const listeners = new Set<() => void>()
const memory = new Map<string, string>()
const parsedCache = new Map<string, { raw: string; value: unknown }>()

function notify() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

function readRaw(storageKey: string): string | null {
  const fallback = memory.get(storageKey)
  if (fallback !== undefined) return fallback
  try {
    return window.localStorage.getItem(storageKey)
  } catch {
    return null
  }
}

function writeRaw(storageKey: string, raw: string) {
  try {
    window.localStorage.setItem(storageKey, raw)
    memory.delete(storageKey)
  } catch {
    memory.set(storageKey, raw)
  }
}

const subscribeNothing = () => () => {}

/**
 * Estado guardado en el dispositivo (localStorage). `parse` debe ser seguro ante
 * datos dañados y `initialValue` debe ser una referencia estable.
 */
export function usePersistedState<T>(key: string, initialValue: T, parse: (raw: string) => T) {
  const storageKey = PREFIX + key

  const read = useCallback((): T => {
    const raw = readRaw(storageKey)
    if (raw === null) return initialValue
    const cached = parsedCache.get(storageKey)
    if (cached?.raw === raw) return cached.value as T
    const value = parse(raw)
    parsedCache.set(storageKey, { raw, value })
    return value
  }, [storageKey, initialValue, parse])

  const value = useSyncExternalStore(subscribe, read, () => initialValue)
  const isLoaded = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  )

  const update = useCallback(
    (next: T | ((previous: T) => T)) => {
      const resolved = next instanceof Function ? next(read()) : next
      writeRaw(storageKey, JSON.stringify(resolved))
      notify()
    },
    [storageKey, read],
  )

  return [value, update, isLoaded] as const
}
