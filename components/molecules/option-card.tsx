import type { ComponentProps } from 'react'
import type { IconName } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/atoms/icon'

interface OptionCardProps extends Omit<ComponentProps<'input'>, 'type'> {
  label: string
  description?: string
  icon?: IconName
  layout?: 'stacked' | 'inline'
}

/** Radio nativo con apariencia de tarjeta grande: accesible por teclado y lector. */
export function OptionCard({ label, description, icon, layout = 'inline', className, ...inputProps }: OptionCardProps) {
  return (
    <label
      className={cn(
        'group relative flex min-h-14 cursor-pointer gap-3 rounded-2xl border-2 border-border bg-card p-4 transition-colors hover:border-primary/60',
        'has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-ring/50',
        layout === 'stacked' ? 'flex-col items-start' : 'items-center',
        className,
      )}
    >
      <input type="radio" className="peer sr-only" {...inputProps} />
      {icon && (
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground group-has-[:checked]:bg-primary group-has-[:checked]:text-primary-foreground">
          <Icon name={icon} className="size-7" />
        </span>
      )}
      <span className="flex flex-col">
        <span className="text-lg font-bold text-card-foreground">{label}</span>
        {description && <span className="text-base leading-snug text-muted-foreground">{description}</span>}
      </span>
      <span
        aria-hidden="true"
        className="absolute right-3 top-3 size-5 rounded-full border-2 border-input bg-background group-has-[:checked]:border-[6px] group-has-[:checked]:border-primary"
      />
    </label>
  )
}
