import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { risks } from '@/config/risks'
import { RiskDetail } from '@/components/organisms/risk-detail'

export const dynamicParams = false

interface RiskPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return risks.map((risk) => ({ slug: risk.slug }))
}

export async function generateMetadata({ params }: RiskPageProps): Promise<Metadata> {
  const { slug } = await params
  return { title: risks.find((risk) => risk.slug === slug)?.name }
}

export default async function RiskPage({ params }: RiskPageProps) {
  const { slug } = await params
  const risk = risks.find((item) => item.slug === slug)
  if (!risk) notFound()
  return <RiskDetail risk={risk} />
}
