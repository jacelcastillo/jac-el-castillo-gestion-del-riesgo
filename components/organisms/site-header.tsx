'use client'

import { usePathname } from 'next/navigation'
import { mainNavigation } from '@/config/site'
import { uiCopy } from '@/config/ui-copy'
import { Logo } from '@/components/atoms/logo'
import { ThemeToggle } from '@/components/atoms/theme-toggle'
import { isActivePath, NavLink } from '@/components/molecules/nav-link'

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-300 items-center gap-3 px-4 py-2">
        <Logo />
        <nav aria-label={uiCopy.mainNavLabel} className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNavigation.map((item) => (
              <li key={item.href}>
                <NavLink item={item} active={isActivePath(pathname, item.href)} />
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto lg:ml-0">
          <ThemeToggle />
        </div>
      </div>
      <div aria-hidden="true" className="flag-rule" />
    </header>
  )
}
