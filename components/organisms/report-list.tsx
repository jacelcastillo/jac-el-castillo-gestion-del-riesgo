'use client'

import Link from 'next/link'
import { uiCopy } from '@/config/ui-copy'
import { useIncidents } from '@/hooks/use-incidents'
import { ReportCard } from '@/components/molecules/report-card'
import { Button, buttonVariants } from '@/components/ui/button'

export function ReportList() {
  const { reports, isLoading, isSyncing, pendingCount, sync } = useIncidents()
  const copy = uiCopy.myReports

  if (isLoading) {
    return (
      <p role="status" className="text-lg text-muted-foreground">
        {copy.loading}
      </p>
    )
  }

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-lg text-muted-foreground">{copy.empty}</p>
        <Link href="/reportar" className={buttonVariants({ size: 'xl' })}>
          {copy.emptyCta}
        </Link>
      </div>
    )
  }

  const newestFirst = [...reports].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div className="flex flex-col gap-6">
      {pendingCount > 0 && (
        <div role="status" className="flex flex-col gap-3 rounded-2xl border-2 border-warning/60 bg-warning/10 p-4">
          <p className="text-lg font-semibold text-foreground">{copy.pendingNotice(pendingCount)}</p>
          <Button type="button" variant="outline" size="touch" onClick={sync} disabled={isSyncing} className="self-start">
            {isSyncing ? copy.syncing : copy.syncNow}
          </Button>
        </div>
      )}
      <ul className="grid gap-4 lg:grid-cols-2">
        {newestFirst.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </ul>
    </div>
  )
}
