import { uiCopy } from '@/config/ui-copy'
import { cn } from '@/lib/utils'

interface StepperProgressProps {
  current: number
  total: number
}

export function StepperProgress({ current, total }: StepperProgressProps) {
  const label = uiCopy.report.stepOf(current + 1, total)
  return (
    <div className="flex flex-col gap-2">
      <p className="text-base font-semibold text-muted-foreground" aria-live="polite">
        {label}
      </p>
      <ol className="flex gap-1.5" aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <li
            key={index}
            className={cn(
              'h-2.5 flex-1 rounded-full transition-colors',
              index <= current ? 'bg-primary' : 'bg-muted',
            )}
          />
        ))}
      </ol>
    </div>
  )
}
