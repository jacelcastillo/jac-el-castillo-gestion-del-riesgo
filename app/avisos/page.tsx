import type { Metadata } from 'next'
import { pageCopy } from '@/config/site'
import { contentService } from '@/lib/services/content-service'
import { NoticesFeed } from '@/components/organisms/notices-feed'
import { SectionTemplate } from '@/components/templates/section-template'

export const metadata: Metadata = { title: pageCopy.notices.title }
export const dynamic = 'force-dynamic'

export default async function NoticesPage() {
  const notices = await contentService.getNotices()
  return (
    <SectionTemplate copy={pageCopy.notices} icon="megaphone">
      <NoticesFeed notices={notices} />
    </SectionTemplate>
  )
}
