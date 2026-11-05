import type { ComponentProps, ReactNode } from 'react'
import { FieldError } from '@/components/atoms/field-error'

interface CheckFieldProps extends Omit<ComponentProps<'input'>, 'type' | 'id'> {
  id: string
  label: ReactNode
  hint?: string
  error?: string
}

/** Casilla nativa con área táctil de tarjeta. */
export function CheckField({ id, label, hint, error, ...inputProps }: CheckFieldProps) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ')
  return (
    <div className="flex flex-col gap-2">
      <div className="flex min-h-14 items-start gap-3 rounded-2xl border-2 border-border bg-card p-4 has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-ring/50">
        <input
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className="mt-0.5 size-6 shrink-0 cursor-pointer accent-primary"
          {...inputProps}
        />
        <div className="flex flex-col gap-1">
          <label htmlFor={id} className="cursor-pointer text-lg font-bold leading-snug text-card-foreground">
            {label}
          </label>
          {hint && (
            <p id={`${id}-hint`} className="text-base leading-snug text-muted-foreground">
              {hint}
            </p>
          )}
        </div>
      </div>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  )
}
