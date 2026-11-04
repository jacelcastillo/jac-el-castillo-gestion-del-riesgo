import { quickLinks } from '@/config/site'
import { uiCopy } from '@/config/ui-copy'
import { SectionHeading } from '@/components/atoms/section-heading'
import { QuickLinkCard } from '@/components/molecules/quick-link-card'

export function QuickLinksGrid() {
  return (
    <section aria-labelledby="accesos-rapidos" className="flex flex-col gap-4">
      <SectionHeading id="accesos-rapidos" icon="grid">
        {uiCopy.home.quickLinksTitle}
      </SectionHeading>
      <ul className="grid gap-3 md:grid-cols-2">
        {quickLinks.map((link) => (
          <li key={link.href}>
            <QuickLinkCard link={link} />
          </li>
        ))}
      </ul>
    </section>
  )
}
