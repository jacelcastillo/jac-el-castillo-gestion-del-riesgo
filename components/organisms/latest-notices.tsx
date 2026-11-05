import { uiCopy } from '@/config/ui-copy'
import type { Notice } from '@/types/content'
import { LandingSection } from '@/components/molecules/landing-section'
import { NoticeCard } from '@/components/molecules/notice-card'

export function LatestNotices({ notices }: { notices: Notice[] }) {
  if (notices.length === 0) return null
  return (
    <LandingSection
      id="ultimos-avisos"
      title={uiCopy.home.latestNoticesTitle}
      icon="megaphone"
      seeAll={{ href: '/avisos', label: uiCopy.home.seeAll }}
    >
      <ul className="grid gap-3 lg:grid-cols-3">
        {notices.map((notice) => (
          <li key={notice.id}>
            <NoticeCard notice={notice} />
          </li>
        ))}
      </ul>
    </LandingSection>
  )
}
