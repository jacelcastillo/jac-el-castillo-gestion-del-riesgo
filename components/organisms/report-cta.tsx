import { ArrowRight, Siren } from 'lucide-react'
import Link from 'next/link'
import { uiCopy } from '@/config/ui-copy'

export function ReportCta() {
  return (
    <Link
      href="/reportar"
      className="group flex min-h-20 items-center gap-4 rounded-2xl bg-primary p-5 text-primary-foreground shadow-md transition-colors outline-none hover:bg-primary/90 focus-visible:ring-4 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/15">
        <Siren aria-hidden="true" className="size-8" />
      </span>
      <span className="flex flex-1 flex-col">
        <span className="text-2xl font-bold">{uiCopy.home.reportCta}</span>
        <span className="text-base opacity-90">{uiCopy.home.reportCtaHint}</span>
      </span>
      <ArrowRight aria-hidden="true" className="size-7 shrink-0 transition-transform group-hover:translate-x-1" />
    </Link>
  )
}
