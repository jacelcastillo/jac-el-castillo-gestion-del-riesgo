import type { RiskPhaseDefinition, RiskPhaseId } from '@/types/content'
import { cn } from '@/lib/utils'
import { IconBadge, type IconBadgeTone } from '@/components/atoms/icon-badge'

const toneByPhase: Record<RiskPhaseId, { badge: IconBadgeTone; border: string }> = {
  antes: { badge: 'success', border: 'border-t-success' },
  durante: { badge: 'warning', border: 'border-t-warning' },
  despues: { badge: 'primary', border: 'border-t-primary' },
}

interface PhaseCardProps {
  phase: RiskPhaseDefinition
  actions: string[]
}

/** Mismo componente para Antes, Durante y Después. */
export function PhaseCard({ phase, actions }: PhaseCardProps) {
  const tone = toneByPhase[phase.id]
  const headingId = `fase-${phase.id}`
  return (
    <section
      aria-labelledby={headingId}
      className={cn('flex flex-col gap-4 rounded-2xl border border-t-8 border-border bg-card p-5', tone.border)}
    >
      <div className="flex items-center gap-3">
        <IconBadge name={phase.icon} tone={tone.badge} />
        <div>
          <h2 id={headingId} className="text-2xl font-bold text-card-foreground">
            {phase.label}
          </h2>
          <p className="text-base text-muted-foreground">{phase.description}</p>
        </div>
      </div>
      <ol className="flex flex-col gap-3">
        {actions.map((action, index) => (
          <li key={action} className="flex gap-3 text-base leading-relaxed text-card-foreground">
            <span
              aria-hidden="true"
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-foreground"
            >
              {index + 1}
            </span>
            <span className="pt-0.5">{action}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
