import { MapPin } from 'lucide-react'
import { uiCopy } from '@/config/ui-copy'
import type { MapPoint } from '@/types/content'
import { MapMarker } from '@/components/atoms/map-marker'

export function MapPointItem({ point, number }: { point: MapPoint; number: number }) {
  return (
    <li className="flex gap-3 rounded-xl border border-border bg-card p-4">
      <MapMarker kind={point.kind} number={number} />
      <div className="flex flex-col gap-1">
        <h4 className="text-lg font-bold text-card-foreground">{point.name}</h4>
        <p className="text-base leading-relaxed text-muted-foreground">{point.description}</p>
        <p className="flex items-start gap-1.5 text-base text-card-foreground">
          <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
          <span>
            <span className="sr-only">{uiCopy.map.reference}: </span>
            {point.reference}
          </span>
        </p>
      </div>
    </li>
  )
}
