import type { LucideProps } from 'lucide-react'
import { iconRegistry, type IconName } from '@/lib/icons'
import { cn } from '@/lib/utils'

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName
}

/** Íconos decorativos: el texto que los acompaña da el significado. */
export function Icon({ name, className, ...props }: IconProps) {
  const Component = iconRegistry[name]
  return <Component aria-hidden="true" className={cn('size-5 shrink-0', className)} {...props} />
}
