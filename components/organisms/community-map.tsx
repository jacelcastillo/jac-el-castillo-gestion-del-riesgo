import { Info } from 'lucide-react'
import { mapPointKinds } from '@/config/map'
import { uiCopy } from '@/config/ui-copy'
import type { MapPoint } from '@/types/content'
import { IconBadge, type IconBadgeTone } from '@/components/atoms/icon-badge'
import { MapMarker } from '@/components/atoms/map-marker'
import { SectionHeading } from '@/components/atoms/section-heading'
import { MapPointItem } from '@/components/molecules/map-point-item'

const toneByKind: Record<MapPoint['kind'], IconBadgeTone> = {
  encuentro: 'success',
  ruta: 'primary',
  riesgo: 'warning',
}

/** Croquis con las posiciones relativas de los puntos + listado accesible de los mismos. */
export function CommunityMap({ points }: { points: MapPoint[] }) {
  const numbered = points.map((point, index) => ({ point, number: index + 1 }))
  const routes = points.filter((point) => point.path && point.path.length > 1)

  return (
    <div className="flex flex-col gap-6">
      <figure className="flex flex-col gap-3">
        <div
          className="relative mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-2xl border-2 border-border bg-muted"
          aria-hidden="true"
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M10 0H0V10" fill="none" className="stroke-border" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
            {routes.map((route) => (
              <polyline
                key={route.id}
                points={route.path!.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="none"
                className="stroke-primary"
                strokeWidth="1.2"
                strokeDasharray="2.5 1.5"
                vectorEffect="non-scaling-stroke"
                style={{ strokeWidth: 4 }}
              />
            ))}
          </svg>
          {numbered.map(({ point, number }) => (
            <MapMarker
              key={point.id}
              kind={point.kind}
              number={number}
              className="absolute -translate-x-1/2 -translate-y-1/2 shadow-md"
              style={{ left: `${point.position.x}%`, top: `${point.position.y}%` }}
            />
          ))}
        </div>
        <figcaption className="flex items-start gap-2 text-base text-muted-foreground">
          <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
          {uiCopy.map.sketchNotice}
        </figcaption>
      </figure>

      <section aria-labelledby="convenciones" className="flex flex-col gap-3">
        <SectionHeading id="convenciones" icon="info">
          {uiCopy.map.legendTitle}
        </SectionHeading>
        <ul className="grid gap-3 sm:grid-cols-3">
          {mapPointKinds.map((kind) => (
            <li key={kind.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <IconBadge name={kind.icon} tone={toneByKind[kind.id]} />
              <div>
                <p className="text-base font-bold text-card-foreground">{kind.label}</p>
                <p className="text-sm text-muted-foreground">{kind.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="listado-puntos" className="flex flex-col gap-4">
        <SectionHeading id="listado-puntos" icon="list">
          {uiCopy.map.listTitle}
        </SectionHeading>
        {mapPointKinds.map((kind) => {
          const items = numbered.filter(({ point }) => point.kind === kind.id)
          if (items.length === 0) return null
          return (
            <div key={kind.id} className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-foreground">{kind.label}</h3>
              <ul className="flex flex-col gap-2">
                {items.map(({ point, number }) => (
                  <MapPointItem key={point.id} point={point} number={number} />
                ))}
              </ul>
            </div>
          )
        })}
      </section>
    </div>
  )
}
