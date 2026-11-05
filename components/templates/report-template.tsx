import Link from 'next/link'
import { pageCopy } from '@/config/site'
import { uiCopy } from '@/config/ui-copy'
import { ReportWizard } from '@/components/organisms/report-wizard'
import { SectionTemplate } from '@/components/templates/section-template'

export function ReportTemplate() {
  return (
    <SectionTemplate copy={pageCopy.report} icon="siren">
      <Link
        href="/mis-reportes"
        className="-mt-4 inline-flex min-h-11 items-center self-start text-base font-semibold text-primary underline underline-offset-4 outline-none focus-visible:ring-4 focus-visible:ring-ring/50"
      >
        {uiCopy.report.myReportsLink}
      </Link>
      <ReportWizard />
    </SectionTemplate>
  )
}
