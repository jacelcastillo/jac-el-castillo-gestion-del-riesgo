import type { Metadata } from 'next'
import { pageCopy } from '@/config/site'
import { PrivacyNotice } from '@/components/organisms/privacy-notice'
import { SectionTemplate } from '@/components/templates/section-template'

export const metadata: Metadata = { title: pageCopy.privacy.title }

export default function PrivacyPage() {
  return (
    <SectionTemplate copy={pageCopy.privacy} icon="shieldCheck">
      <PrivacyNotice />
    </SectionTemplate>
  )
}
