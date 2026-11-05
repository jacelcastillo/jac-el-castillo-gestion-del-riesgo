import type { Metadata } from 'next'
import { pageCopy } from '@/config/site'
import { ReportList } from '@/components/organisms/report-list'
import { SectionTemplate } from '@/components/templates/section-template'

export const metadata: Metadata = { title: pageCopy.myReports.title }

export default function MyReportsPage() {
  return (
    <SectionTemplate copy={pageCopy.myReports} icon="clipboard">
      <ReportList />
    </SectionTemplate>
  )
}
