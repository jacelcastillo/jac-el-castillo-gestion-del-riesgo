import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { QuickLink } from '@/types/content'
import { IconBadge } from '@/components/atoms/icon-badge'

export function QuickLinkCard({ link }: { link: QuickLink }) {
  return (
    <Link
      href={link.href}
      className="group flex min-h-20 items-center gap-4 rounded-2xl border-2 border-border bg-card p-4 transition-colors outline-none hover:border-primary focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-ring/50"
    >
      <IconBadge name={link.icon} />
      <span className="flex flex-1 flex-col gap-0.5">
        <span className="text-lg font-bold text-card-foreground">{link.title}</span>
        <span className="text-base text-muted-foreground">{link.description}</span>
      </span>
      <ChevronRight aria-hidden="true" className="size-6 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}
