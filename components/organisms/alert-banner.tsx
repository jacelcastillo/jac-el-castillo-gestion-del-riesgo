import { alertLevels } from '@/config/alert-levels'
import { uiCopy } from '@/config/ui-copy'
import { formatDateTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { AlertLevelId, AlertStatus } from '@/types/content'
import { Icon } from '@/components/atoms/icon'

const toneByLevel: Record<AlertLevelId, string> = {
  verde: 'bg-success text-success-foreground',
  amarilla: 'bg-caution text-caution-foreground',
  naranja: 'bg-warning text-warning-foreground',
  roja: 'bg-destructive text-destructive-foreground',
}

export function AlertBanner({ alert }: { alert: AlertStatus }) {
  const level = alertLevels[alert.level]
  return (
    <section
      aria-labelledby="estado-alerta"
      className={cn('flex flex-col gap-3 rounded-2xl p-5 shadow-sm', toneByLevel[alert.level])}
    >
      <p className="text-sm font-bold uppercase tracking-wider opacity-90">{uiCopy.alert.currentLabel}</p>
      <div className="flex items-start gap-3">
        <Icon name={level.icon} className="mt-0.5 size-9 shrink-0" />
        <div className="flex flex-col gap-1">
          <h2 id="estado-alerta" className="text-balance text-2xl font-bold leading-tight">
            {level.label}
          </h2>
          <p className="text-lg font-semibold leading-snug">{alert.title}</p>
        </div>
      </div>
      <p className="text-base leading-relaxed">{alert.description}</p>
      <p className="rounded-xl bg-background/20 p-3 text-base font-semibold leading-relaxed">
        {uiCopy.alert.whatToDo}: {level.whatToDo}
      </p>
      <p className="text-sm opacity-90">
        {uiCopy.alert.updated}: {formatDateTime(alert.updatedAt)} · {uiCopy.alert.source}: {alert.source}
      </p>
    </section>
  )
}
