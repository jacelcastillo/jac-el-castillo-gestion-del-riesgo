import type { ReactNode } from 'react'
import type { IconName } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { Icon } from './icon'

interface SectionHeadingProps {
  id?: string
  icon?: IconName
  children: ReactNode
  className?: string
  as?: 'h2' | 'h3'
}

export function SectionHeading({ id, icon, children, className, as: Tag = 'h2' }: SectionHeadingProps) {
  return (
    <Tag
      id={id}
      className={cn(
        'flex items-center gap-2 text-balance font-bold text-foreground',
        Tag === 'h2' ? 'text-xl md:text-2xl' : 'text-lg',
        className,
      )}
    >
      {icon && <Icon name={icon} className="size-6 text-primary" />}
      {children}
    </Tag>
  )
}
