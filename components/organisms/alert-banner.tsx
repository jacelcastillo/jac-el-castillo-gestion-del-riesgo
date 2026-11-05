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

export function AlertBanner({ alert }: { alert: AlertStatus | null }) {
  if (!alert) {
    return (
      <section
        aria-labelledby="estado-alerta"
        className="flex items-start gap-3 rounded-2xl border-2 border-border bg-card p-5 text-card-foreground"
      >
        <Icon name="alert" className="mt-0.5 size-7 shrink-0 text-muted-foreground" />
        <div className="flex flex-col gap-1">
          <h2 id="estado-alerta" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            {uiCopy.alert.currentLabel}
          </h2>
          <p className="text-lg font-semibold leading-snug">{uiCopy.alert.unavailable}</p>
        </div>
      </section>
    )
  }

  const level = alertLevels[alert.level]

  if (alert.level === 'verde') {
    return (
      <section
        aria-labelledby="estado-alerta"
        className={cn('flex flex-wrap items-center gap-x-3 gap-y-1 self-start rounded-xl px-4 py-3', toneByLevel.verde)}
      >
        <Icon name={level.icon} className="size-6 shrink-0" />
        <h2 id="estado-alerta" className="text-lg font-bold">
          {uiCopy.alert.none}
        </h2>
        {alert.updatedAt && (
          <p className="text-sm opacity-90">
            {uiCopy.alert.updated}: {formatDateTime(alert.updatedAt)}
          </p>
        )}
      </section>
    )
  }

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
          {alert.title && <p className="text-lg font-semibold leading-snug">{alert.title}</p>}
        </div>
      </div>
      {alert.description && <p className="text-base leading-relaxed">{alert.description}</p>}
      <p className="rounded-xl bg-background/20 p-3 text-base font-semibold leading-relaxed">
        {uiCopy.alert.whatToDo}: {level.whatToDo}
      </p>
      {(alert.updatedAt || alert.source) && (
        <p className="text-sm opacity-90">
          {alert.updatedAt && `${uiCopy.alert.updated}: ${formatDateTime(alert.updatedAt)}`}
          {alert.updatedAt && alert.source && ' · '}
          {alert.source && `${uiCopy.alert.source}: ${alert.source}`}
        </p>
      )}
    </section>
  )
}
