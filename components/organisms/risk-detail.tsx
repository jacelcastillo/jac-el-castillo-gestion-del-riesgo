import { ArrowLeft, Eye, MapPin } from 'lucide-react'
import Link from 'next/link'
import { riskPhases } from '@/config/risk-phases'
import { uiCopy } from '@/config/ui-copy'
import type { Risk } from '@/types/content'
import { IconBadge } from '@/components/atoms/icon-badge'
import { PhaseCard } from '@/components/molecules/phase-card'

export function RiskDetail({ risk }: { risk: Risk }) {
  return (
    <article className="flex flex-col gap-6">
      <Link
        href="/riesgos"
        className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl text-base font-bold text-primary outline-none hover:underline focus-visible:ring-4 focus-visible:ring-ring/50"
      >
        <ArrowLeft aria-hidden="true" className="size-5" />
        {uiCopy.risks.back}
      </Link>

      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <IconBadge name={risk.icon} tone="warning" size="lg" />
          <h1 className="text-balance text-3xl font-bold text-foreground md:text-4xl">{risk.name}</h1>
        </div>
        <p className="text-pretty text-lg leading-relaxed text-muted-foreground">{risk.summary}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <section aria-labelledby="donde" className="flex flex-col gap-2 rounded-2xl bg-muted p-5">
          <h2 id="donde" className="flex items-center gap-2 text-lg font-bold text-foreground">
            <MapPin aria-hidden="true" className="size-5 text-primary" />
            {uiCopy.risks.whereInSector}
          </h2>
          <p className="text-base leading-relaxed text-foreground">{risk.whereInSector}</p>
        </section>
        <section aria-labelledby="senales" className="flex flex-col gap-2 rounded-2xl border-2 border-warning bg-warning/10 p-5">
          <h2 id="senales" className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Eye aria-hidden="true" className="size-5 text-warning-foreground dark:text-warning" />
            {uiCopy.risks.warningSigns}
          </h2>
          <ul className="flex list-disc flex-col gap-1 pl-5 text-base leading-relaxed text-foreground">
            {risk.warningSigns.map((sign) => (
              <li key={sign}>{sign}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {riskPhases.map((phase) => (
          <PhaseCard key={phase.id} phase={phase} actions={risk.phases[phase.id]} />
        ))}
      </div>
    </article>
  )
}
