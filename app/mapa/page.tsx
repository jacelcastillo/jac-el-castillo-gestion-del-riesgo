import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { pageCopy } from '@/config/site'
import { contentService } from '@/lib/services/content-service'
import { MapTemplate } from '@/components/templates/map-template'

export const metadata: Metadata = { title: pageCopy.map.title }
export const dynamic = 'force-dynamic'

export default async function MapPage() {
  const points = await contentService.getMapPoints()
  if (points !== null && points.length === 0) notFound()
  return <MapTemplate points={points} />
}
