import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import type { IconName } from '@/lib/icons'
import { SectionHeading } from '@/components/atoms/section-heading'

interface LandingSectionProps {
  id: string
  title: string
  icon?: IconName
  seeAll?: { href: string; label: string }
  children: ReactNode
}

export function LandingSection({ id, title, icon, seeAll, children }: LandingSectionProps) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <SectionHeading id={id} icon={icon}>
          {title}
        </SectionHeading>
        {seeAll && (
          <Link
            href={seeAll.href}
            className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-lg px-2 text-base font-semibold text-primary outline-none hover:underline focus-visible:ring-4 focus-visible:ring-ring/50"
          >
            {seeAll.label}
            <ChevronRight aria-hidden="true" className="size-5" />
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}
