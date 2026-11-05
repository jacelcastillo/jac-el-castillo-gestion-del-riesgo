import Image from 'next/image'
import Link from 'next/link'
import brandSquare from '@/public/brand/cropped-favicon.webp'
import { siteConfig } from '@/config/site'

export function Logo() {
  return (
    <Link
      href="/"
      className="flex min-h-11 min-w-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-4 focus-visible:ring-ring/60"
    >
      <Image src={brandSquare} alt="" width={40} height={40} className="size-10 shrink-0 rounded-lg" priority />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate font-display text-base font-bold text-foreground">{siteConfig.shortName}</span>
        <span className="truncate text-xs text-muted-foreground">{siteConfig.organization}</span>
      </span>
    </Link>
  )
}
