import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/types/content'
import { Icon } from '@/components/atoms/icon'

interface NavLinkProps {
  item: NavItem
  active: boolean
  onNavigate?: () => void
  className?: string
}

export function NavLink({ item, active, onNavigate, className }: NavLinkProps) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex min-h-11 items-center gap-2 rounded-xl px-3 text-base font-semibold transition-colors outline-none focus-visible:ring-4 focus-visible:ring-ring/50',
        item.highlight
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : active
            ? 'bg-primary/10 text-primary'
            : 'text-foreground hover:bg-muted',
        className,
      )}
    >
      <Icon name={item.icon} />
      {item.label}
    </Link>
  )
}

function matchesPath(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}

export function isActivePath(pathname: string, item: Pick<NavItem, 'href' | 'match'>) {
  return [item.href, ...(item.match ?? [])].some((href) => matchesPath(pathname, href))
}
