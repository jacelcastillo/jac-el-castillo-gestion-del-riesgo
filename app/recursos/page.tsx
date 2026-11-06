import type { Metadata } from 'next'
import { pageCopy } from '@/config/site'
import { contentService } from '@/lib/services/content-service'
import { ResourcesTemplate } from '@/components/templates/resources-template'

export const metadata: Metadata = { title: pageCopy.resources.title }
export const dynamic = 'force-dynamic'

export default async function ResourcesPage() {
  const resources = await contentService.getResources()
  return <ResourcesTemplate resources={resources} />
}
