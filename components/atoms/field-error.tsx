import { AlertCircle } from 'lucide-react'

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="flex items-start gap-1.5 text-base font-medium text-destructive">
      <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      {message}
    </p>
  )
}
