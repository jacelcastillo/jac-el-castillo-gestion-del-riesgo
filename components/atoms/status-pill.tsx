import { incidentStatuses } from '@/config/incident'
import { cn } from '@/lib/utils'
import type { IncidentStatus } from '@/types/incident'
import { Icon } from './icon'

const toneByStatus: Record<IncidentStatus, string> = {
  pendiente: 'bg-warning/15 text-warning-foreground ring-warning/50 dark:text-warning',
  enviado: 'bg-primary/10 text-primary ring-primary/30',
  en_atencion: 'bg-caution/30 text-caution-foreground ring-caution/60 dark:text-caution',
  cerrado: 'bg-success/15 text-success ring-success/40',
}

export function StatusPill({ status, className }: { status: IncidentStatus; className?: string }) {
  const definition = incidentStatuses[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset',
        toneByStatus[status],
        className,
      )}
    >
      <Icon name={definition.icon} className="size-4" />
      {definition.label}
    </span>
  )
}
