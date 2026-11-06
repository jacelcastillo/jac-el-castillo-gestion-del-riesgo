import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { pageCopy } from '@/config/site'
import { uiCopy } from '@/config/ui-copy'
import { IconBadge } from '@/components/atoms/icon-badge'

export function MapAccessCard() {
  return (
    <Link
      href="/mapa"
      className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 outline-none transition-colors hover:bg-muted focus-visible:ring-4 focus-visible:ring-ring/50"
    >
      <IconBadge name="map" />
      <span className="flex flex-1 flex-col">
        <span className="text-lg font-bold text-card-foreground">{uiCopy.learn.mapOpen}</span>
        <span className="text-base text-muted-foreground">{pageCopy.map.intro}</span>
      </span>
      <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-primary" />
    </Link>
  )
}
