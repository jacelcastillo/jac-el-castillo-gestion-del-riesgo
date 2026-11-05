import type { Metadata } from 'next'
import { pageCopy } from '@/config/site'
import { ReportTemplate } from '@/components/templates/report-template'

export const metadata: Metadata = { title: pageCopy.report.title }

export default function ReportPage() {
  return <ReportTemplate />
}
