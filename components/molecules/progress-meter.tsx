import { cn } from '@/lib/utils'

interface ProgressMeterProps {
  label: string
  value: number
  max: number
  className?: string
}

export function ProgressMeter({ label, value, max, className }: ProgressMeterProps) {
  const percent = max === 0 ? 0 : Math.round((value / max) * 100)
  const complete = percent === 100
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-baseline justify-between gap-2 text-base">
        <span className="font-semibold text-foreground">{label}</span>
        <span className="font-bold tabular-nums text-foreground">
          {value}/{max} · {percent}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value} de ${max}`}
        className="h-3 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500', complete ? 'bg-success' : 'bg-primary')}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
