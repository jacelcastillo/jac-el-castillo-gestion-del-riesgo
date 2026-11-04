import Image from 'next/image'
import Link from 'next/link'
import { siteConfig } from '@/config/site'

export function Logo() {
  return (
    <Link
      href="/"
      className="flex min-h-11 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-4 focus-visible:ring-ring/60"
    >
      <Image src="/icons/icon-192.png" alt="" width={40} height={40} className="size-10 rounded-lg" priority />
      <span className="flex flex-col leading-tight">
        <span className="text-base font-bold text-foreground">{siteConfig.shortName}</span>
        <span className="text-xs text-muted-foreground">{siteConfig.organization}</span>
      </span>
    </Link>
  )
}
