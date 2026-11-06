import { contacts } from '@/config/contacts'
import { contentService } from '@/lib/services/content-service'
import { HomeTemplate } from '@/components/templates/home-template'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [alert, notices, committee, mapPoints] = await Promise.all([
    contentService.getCurrentAlert(),
    contentService.getUpcomingNotices({ limit: 3 }),
    contentService.getCommittee(),
    contentService.getMapPoints(),
  ])
  return (
    <HomeTemplate
      alert={alert}
      notices={notices}
      contacts={contacts}
      committee={committee}
      hasMap={(mapPoints ?? []).length > 0}
    />
  )
}
