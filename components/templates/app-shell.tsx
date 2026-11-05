import type { ReactNode } from 'react'
import { uiCopy } from '@/config/ui-copy'
import { BottomNav } from '@/components/organisms/bottom-nav'
import { OfflineSupport } from '@/components/organisms/offline-support'
import { SiteFooter } from '@/components/organisms/site-footer'
import { SiteHeader } from '@/components/organisms/site-header'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only rounded-xl bg-primary font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:px-4 focus:py-3"
      >
        {uiCopy.skipToContent}
      </a>
      <div className="flex min-h-dvh flex-col pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0">
        <SiteHeader />
        <OfflineSupport />
        <main id="contenido" className="mx-auto w-full max-w-300 flex-1 px-4 py-6 lg:py-10">
          {children}
        </main>
        <SiteFooter />
      </div>
      <BottomNav />
    </>
  )
}
