import { pageCopy } from '@/config/site'
import { uiCopy } from '@/config/ui-copy'
import type { MapPoint } from '@/types/content'
import { CommunityMap } from '@/components/organisms/community-map'
import { SectionTemplate } from '@/components/templates/section-template'

/** `points` es `null` cuando no se pudo cargar el mapa. */
export function MapTemplate({ points }: { points: MapPoint[] | null }) {
  return (
    <SectionTemplate copy={pageCopy.map} icon="map">
      {points === null ? (
        <p role="status" className="rounded-xl border border-border bg-card p-4 text-base text-card-foreground">
          {uiCopy.map.unavailable}
        </p>
      ) : (
        <CommunityMap points={points} />
      )}
    </SectionTemplate>
  )
}
