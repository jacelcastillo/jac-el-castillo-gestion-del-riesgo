'use client'

import { useCallback, useMemo } from 'react'
import { parseIdList } from '@/lib/parse-id-list'
import { usePersistedState } from './use-persisted-state'

const NO_IDS: string[] = []

/** Lista de ítems marcados con progreso, guardada en el dispositivo. */
export function useChecklist(storageKey: string, allIds: string[]) {
  const [checkedIds, setCheckedIds, isLoaded] = usePersistedState<string[]>(
    storageKey,
    NO_IDS,
    parseIdList,
  )

  const checked = useMemo(() => new Set(checkedIds), [checkedIds])

  const toggle = useCallback(
    (id: string) =>
      setCheckedIds((previous) =>
        previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id],
      ),
    [setCheckedIds],
  )

  const reset = useCallback(() => setCheckedIds([]), [setCheckedIds])

  const doneCount = allIds.filter((id) => checked.has(id)).length
  const total = allIds.length
  const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100)

  return {
    isChecked: (id: string) => checked.has(id),
    toggle,
    reset,
    doneCount,
    total,
    percent,
    isComplete: total > 0 && doneCount === total,
    isLoaded,
  }
}
