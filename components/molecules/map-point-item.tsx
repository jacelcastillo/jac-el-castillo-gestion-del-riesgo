import { ExternalLink, MapPin } from 'lucide-react'
import { uiCopy } from '@/config/ui-copy'
import { directionsUrl, placeUrl } from '@/lib/map'
import type { MapPoint } from '@/types/content'
import { MapMarker } from '@/components/atoms/map-marker'

export function MapPointItem({ point, number }: { point: MapPoint; number: number }) {
  const isRisk = point.kind === 'riesgo'
  const href = isRisk ? placeUrl(point.target) : directionsUrl(point.target)
  const label = isRisk ? uiCopy.map.viewOnGoogleMaps : uiCopy.map.directions

  return (
    <li className="flex gap-3 rounded-xl border border-border bg-card p-4">
      <MapMarker kind={point.kind} number={number} />
      <div className="flex flex-col gap-1">
        <h4 className="text-lg font-bold text-card-foreground">{point.name}</h4>
        {point.description && <p className="text-base leading-relaxed text-muted-foreground">{point.description}</p>}
        {point.reference && (
          <p className="flex items-start gap-1.5 text-base text-card-foreground">
            <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
            <span>
              <span className="sr-only">{uiCopy.map.reference}: </span>
              {point.reference}
            </span>
          </p>
        )}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex min-h-11 w-fit items-center gap-1.5 rounded-lg px-2 text-base font-semibold text-primary outline-none hover:underline focus-visible:ring-4 focus-visible:ring-ring/50"
        >
          {label}
          <ExternalLink aria-hidden="true" className="size-4" />
          <span className="sr-only"> {point.name} {uiCopy.map.opensInNewTab}</span>
        </a>
      </div>
    </li>
  )
}
