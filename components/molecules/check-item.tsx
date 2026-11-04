import { Check } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CheckItemProps {
  id: string
  label: string
  hint?: string
  checked: boolean
  onToggle: () => void
  /** Contenido a la izquierda, ej. número de paso o ícono. */
  leading?: ReactNode
}

/** Casilla grande y táctil reutilizada por el kit y el plan familiar. */
export function CheckItem({ id, label, hint, checked, onToggle, leading }: CheckItemProps) {
  const inputId = `check-${id}`
  return (
    <li>
      <label
        htmlFor={inputId}
        className={cn(
          'flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-ring/50',
          checked ? 'border-success bg-success/10' : 'border-border bg-card hover:border-primary/50',
        )}
      >
        <input id={inputId} type="checkbox" checked={checked} onChange={onToggle} className="peer sr-only" />
        <span
          aria-hidden="true"
          className={cn(
            'flex size-7 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
            checked ? 'border-success bg-success text-success-foreground' : 'border-input bg-background',
          )}
        >
          {checked && <Check className="size-5" strokeWidth={3} />}
        </span>
        {leading}
        <span className="flex flex-col">
          <span className={cn('text-base font-semibold text-card-foreground', checked && 'line-through decoration-2 opacity-80')}>
            {label}
          </span>
          {hint && <span className="text-sm leading-relaxed text-muted-foreground">{hint}</span>}
        </span>
      </label>
    </li>
  )
}
