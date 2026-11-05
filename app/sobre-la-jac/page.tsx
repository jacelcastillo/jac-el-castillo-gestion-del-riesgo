import type { Metadata } from 'next'
import { aboutContent } from '@/config/about'
import { pageCopy } from '@/config/site'
import { contentService } from '@/lib/services/content-service'
import { AboutSections } from '@/components/organisms/about-sections'
import { SectionTemplate } from '@/components/templates/section-template'

export const metadata: Metadata = { title: pageCopy.about.title }
export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const members = await contentService.getCommittee()
  const about = { ...aboutContent, committee: { ...aboutContent.committee, members } }
  return (
    <SectionTemplate copy={pageCopy.about} icon="users">
      <AboutSections about={about} />
    </SectionTemplate>
  )
}
