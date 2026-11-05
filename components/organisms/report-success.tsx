import { CheckCircle2, CloudOff } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { uiCopy } from '@/config/ui-copy'
import { Button, buttonVariants } from '@/components/ui/button'

interface ReportSuccessProps {
  sent: boolean
  onNewReport: () => void
}

export function ReportSuccess({ sent, onNewReport }: ReportSuccessProps) {
  const copy = uiCopy.report
  const titleRef = useRef<HTMLHeadingElement>(null)
  const Icon = sent ? CheckCircle2 : CloudOff

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  return (
    <section
      aria-labelledby="report-success-title"
      className="flex flex-col items-start gap-5 rounded-2xl border-2 border-border bg-card p-6"
    >
      <Icon aria-hidden="true" className={sent ? 'size-12 text-success' : 'size-12 text-warning'} />
      <div className="flex flex-col gap-2">
        <h2 id="report-success-title" ref={titleRef} tabIndex={-1} className="text-2xl font-bold outline-none">
          {copy.successTitle}
        </h2>
        <p role="status" className="text-lg leading-relaxed text-muted-foreground">
          {sent ? copy.successOnline : copy.successOffline}
        </p>
      </div>
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <Link href="/mis-reportes" className={buttonVariants({ size: 'xl' })}>
          {copy.goToMyReports}
        </Link>
        <Button type="button" variant="outline" size="xl" onClick={onNewReport}>
          {copy.newReport}
        </Button>
      </div>
    </section>
  )
}
