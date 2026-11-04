import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import type { MapPointKind } from '@/types/content'

const markerToneByKind: Record<MapPointKind, string> = {
  encuentro: 'bg-success text-success-foreground rounded-full',
  ruta: 'bg-primary text-primary-foreground rounded-full',
  riesgo: 'bg-warning text-warning-foreground rounded-md',
}

interface MapMarkerProps {
  kind: MapPointKind
  number: number
  className?: string
  style?: CSSProperties
}

/** Número del punto: enlaza visualmente el croquis con el listado. */
export function MapMarker({ kind, number, className, style }: MapMarkerProps) {
  return (
    <span
      aria-hidden="true"
      style={style}
      className={cn(
        'flex size-8 shrink-0 items-center justify-center text-sm font-bold ring-2 ring-background',
        markerToneByKind[kind],
        className,
      )}
    >
      {number}
    </span>
  )
}
