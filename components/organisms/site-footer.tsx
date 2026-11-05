import { siteConfig } from '@/config/site'
import { uiCopy } from '@/config/ui-copy'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto flex w-full max-w-300 flex-col gap-2 px-4 py-6 text-base text-muted-foreground">
        <p>{uiCopy.footer.disclaimer}</p>
        <p>{uiCopy.footer.rights}</p>
        <a
          href={siteConfig.mainSiteUrl}
          className="inline-flex min-h-11 items-center self-start font-semibold text-primary underline underline-offset-4 outline-none focus-visible:ring-4 focus-visible:ring-ring/50"
        >
          {uiCopy.footer.mainSite}
        </a>
      </div>
    </footer>
  )
}
