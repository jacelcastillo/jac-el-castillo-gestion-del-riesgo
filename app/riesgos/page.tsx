import type { Metadata } from 'next'
import { risks } from '@/config/risks'
import { pageCopy } from '@/config/site'
import { RiskGrid } from '@/components/organisms/risk-grid'
import { SectionTemplate } from '@/components/templates/section-template'

export const metadata: Metadata = { title: pageCopy.risks.title }

export default function RisksPage() {
  return (
    <SectionTemplate copy={pageCopy.risks} icon="alert">
      <RiskGrid risks={risks} />
    </SectionTemplate>
  )
}
