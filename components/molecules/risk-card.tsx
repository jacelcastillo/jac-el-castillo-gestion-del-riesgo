import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { uiCopy } from '@/config/ui-copy'
import type { Risk } from '@/types/content'
import { IconBadge } from '@/components/atoms/icon-badge'

export function RiskCard({ risk }: { risk: Risk }) {
  return (
    <Link
      href={`/riesgos/${risk.slug}`}
      className="group flex h-full flex-col gap-3 rounded-2xl border-2 border-border bg-card p-5 transition-colors outline-none hover:border-warning focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-ring/50"
    >
      <IconBadge name={risk.icon} tone="warning" size="lg" />
      <h2 className="text-xl font-bold text-card-foreground">{risk.name}</h2>
      <p className="flex-1 text-base leading-relaxed text-muted-foreground">{risk.summary}</p>
      <span className="inline-flex items-center gap-2 text-base font-bold text-primary">
        {uiCopy.risks.open}
        <ArrowRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  )
}
