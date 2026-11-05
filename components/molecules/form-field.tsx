import type { ReactNode } from 'react'
import { FieldError } from '@/components/atoms/field-error'
import { Label } from '@/components/ui/label'

interface FormFieldProps {
  id: string
  label: string
  hint?: string
  error?: string
  children: ReactNode
}

/** Atributos de accesibilidad que el control de un `FormField` debe llevar. */
export function fieldA11y(id: string, { hint, error }: { hint?: string; error?: string }) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ')
  return { id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy || undefined }
}

export function FormField({ id, label, hint, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-base font-semibold leading-snug">
        {label}
      </Label>
      {hint && (
        <p id={`${id}-hint`} className="text-base leading-snug text-muted-foreground">
          {hint}
        </p>
      )}
      {children}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  )
}
