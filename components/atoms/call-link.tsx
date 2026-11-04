import { cva, type VariantProps } from 'class-variance-authority'
import { Phone } from 'lucide-react'
import type { ReactNode } from 'react'
import { telHref } from '@/lib/format'
import { cn } from '@/lib/utils'

const callLinkVariants = cva(
  'inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-4 font-bold transition-colors outline-none focus-visible:ring-4 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:size-5 [&_svg]:shrink-0',
  {
    variants: {
      tone: {
        emergency: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border-2 border-primary text-primary hover:bg-primary/10',
      },
      size: {
        md: 'text-base',
        lg: 'min-h-14 px-6 text-lg [&_svg]:size-6',
      },
    },
    defaultVariants: { tone: 'primary', size: 'md' },
  },
)

interface CallLinkProps extends VariantProps<typeof callLinkVariants> {
  phone: string
  /** Texto accesible completo, ej. "Llamar a Bomberos, 119". */
  accessibleLabel: string
  children: ReactNode
  className?: string
}

export function CallLink({ phone, accessibleLabel, children, tone, size, className }: CallLinkProps) {
  return (
    <a href={telHref(phone)} aria-label={accessibleLabel} className={cn(callLinkVariants({ tone, size }), className)}>
      <Phone aria-hidden="true" />
      <span>{children}</span>
    </a>
  )
}
