'use client'

import { usePathname } from 'next/navigation'
import { bottomNavigation } from '@/config/site'
import { uiCopy } from '@/config/ui-copy'
import { isActivePath, NavLink } from '@/components/molecules/nav-link'

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label={uiCopy.bottomNavLabel}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="mx-auto flex max-w-xl items-stretch gap-1 px-2 py-1">
        {bottomNavigation.map((item) => (
          <li key={item.href} className="flex flex-1">
            <NavLink
              item={item}
              active={isActivePath(pathname, item.href)}
              className="min-h-14 flex-1 flex-col justify-center gap-0.5 px-1 text-xs"
            />
          </li>
        ))}
      </ul>
    </nav>
  )
}
