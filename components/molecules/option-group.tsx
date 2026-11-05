import type { ReactNode } from 'react'
import { FieldError } from '@/components/atoms/field-error'
import { cn } from '@/lib/utils'

interface OptionGroupProps {
  name: string
  legend: string
  hideLegend?: boolean
  error?: string
  className?: string
  children: ReactNode
}

/** Grupo de opciones tipo tarjeta con leyenda y error asociados. */
export function OptionGroup({ name, legend, hideLegend, error, className, children }: OptionGroupProps) {
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined} className="flex min-w-0 flex-col gap-3">
      <legend className={cn('mb-3 text-lg font-bold text-foreground', hideLegend && 'sr-only')}>{legend}</legend>
      <div className={cn('grid gap-3', className)}>{children}</div>
      <FieldError id={`${name}-error`} message={error} />
    </fieldset>
  )
}
