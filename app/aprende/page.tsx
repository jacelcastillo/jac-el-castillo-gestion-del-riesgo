import type { Metadata } from 'next'
import { risks } from '@/config/risks'
import { pageCopy } from '@/config/site'
import { contentService } from '@/lib/services/content-service'
import { LearnTemplate } from '@/components/templates/learn-template'

export const metadata: Metadata = { title: pageCopy.learn.title }
export const dynamic = 'force-dynamic'

export default async function LearnPage() {
  const mapPoints = await contentService.getMapPoints()
  return <LearnTemplate risks={risks} hasMap={(mapPoints ?? []).length > 0} />
}
