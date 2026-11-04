import { cva, type VariantProps } from 'class-variance-authority'
import type { IconName } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { Icon } from './icon'

const iconBadgeVariants = cva('inline-flex shrink-0 items-center justify-center rounded-xl', {
  variants: {
    tone: {
      primary: 'bg-primary/10 text-primary dark:bg-primary/20',
      solid: 'bg-primary text-primary-foreground',
      warning: 'bg-warning/15 text-warning-foreground dark:text-warning',
      danger: 'bg-destructive/10 text-destructive dark:bg-destructive/20',
      success: 'bg-success/15 text-success',
      caution: 'bg-caution/30 text-caution-foreground dark:text-caution',
      muted: 'bg-muted text-muted-foreground',
    },
    size: {
      sm: 'size-9 [&_svg]:size-5',
      md: 'size-11 [&_svg]:size-6',
      lg: 'size-14 [&_svg]:size-7',
    },
  },
  defaultVariants: { tone: 'primary', size: 'md' },
})

export type IconBadgeTone = NonNullable<VariantProps<typeof iconBadgeVariants>['tone']>

interface IconBadgeProps extends VariantProps<typeof iconBadgeVariants> {
  name: IconName
  className?: string
}

export function IconBadge({ name, tone, size, className }: IconBadgeProps) {
  return (
    <span className={cn(iconBadgeVariants({ tone, size }), className)}>
      <Icon name={name} />
    </span>
  )
}
