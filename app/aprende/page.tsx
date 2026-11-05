import type { Metadata } from 'next'
import { risks } from '@/config/risks'
import { pageCopy } from '@/config/site'
import { LearnTemplate } from '@/components/templates/learn-template'

export const metadata: Metadata = { title: pageCopy.learn.title }

export default function LearnPage() {
  return <LearnTemplate risks={risks} />
}
