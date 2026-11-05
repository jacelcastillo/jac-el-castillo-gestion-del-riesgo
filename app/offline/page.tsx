import type { Metadata } from 'next'
import Link from 'next/link'
import { pageCopy } from '@/config/site'
import { uiCopy } from '@/config/ui-copy'
import { LifeRiskBanner } from '@/components/molecules/life-risk-banner'
import { SectionTemplate } from '@/components/templates/section-template'

export const metadata: Metadata = { title: pageCopy.offline.title }

export default function OfflinePage() {
  return (
    <SectionTemplate copy={pageCopy.offline} icon="alert">
      <LifeRiskBanner />
      <Link href="/" className="w-fit text-lg font-semibold text-primary underline underline-offset-4">
        {uiCopy.offlinePage.homeLink}
      </Link>
    </SectionTemplate>
  )
}
