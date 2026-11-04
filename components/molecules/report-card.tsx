import { MapPin } from 'lucide-react'
import { incidentStatuses, incidentTypes } from '@/config/incident'
import { uiCopy } from '@/config/ui-copy'
import { formatDateTime } from '@/lib/format'
import { describeLocation } from '@/lib/incident-format'
import type { IncidentReport } from '@/types/incident'
import { IconBadge } from '@/components/atoms/icon-badge'
import { StatusPill } from '@/components/atoms/status-pill'

export function ReportCard({ report }: { report: IncidentReport }) {
  const type = incidentTypes.find((item) => item.id === report.type)
  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        {type?.icon && <IconBadge name={type.icon} tone="warning" />}
        <div className="flex flex-1 flex-col gap-1">
          <h3 className="text-lg font-bold text-card-foreground">{type?.label}</h3>
          <p className="text-sm text-muted-foreground">
            {uiCopy.myReports.createdAt}: {formatDateTime(report.createdAt)}
            {report.remoteId && <> · {report.remoteId}</>}
          </p>
        </div>
      </div>
      <StatusPill status={report.status} className="self-start" />
      <p className="text-sm text-muted-foreground">{incidentStatuses[report.status].description}</p>
      <p className="line-clamp-3 text-base leading-relaxed text-card-foreground">{report.description}</p>
      <p className="flex items-start gap-1.5 text-base text-muted-foreground">
        <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
        {describeLocation(report.location)}
      </p>
    </li>
  )
}
