import type { Metadata } from 'next'
import { emergencyKit, familyPlanSteps } from '@/config/preparedness'
import { pageCopy } from '@/config/site'
import { EmergencyKit } from '@/components/organisms/emergency-kit'
import { FamilyPlan } from '@/components/organisms/family-plan'
import { SectionTemplate } from '@/components/templates/section-template'

export const metadata: Metadata = { title: pageCopy.prepare.title }

export default function PreparePage() {
  return (
    <SectionTemplate copy={pageCopy.prepare} icon="backpack">
      <FamilyPlan steps={familyPlanSteps} />
      <EmergencyKit categories={emergencyKit} />
    </SectionTemplate>
  )
}
