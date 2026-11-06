import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { IconName } from '@/lib/icons'
import { IconBadge } from '@/components/atoms/icon-badge'

interface AccessCardProps {
  href: string
  icon: IconName
  title: string
  description: string
}

export function AccessCard({ href, icon, title, description }: AccessCardProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 outline-none transition-colors hover:bg-muted focus-visible:ring-4 focus-visible:ring-ring/50"
    >
      <IconBadge name={icon} />
      <span className="flex flex-1 flex-col">
        <span className="text-lg font-bold text-card-foreground">{title}</span>
        <span className="text-base text-muted-foreground">{description}</span>
      </span>
      <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-primary" />
    </Link>
  )
}
