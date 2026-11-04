import { Calendar, Clock, MapPin } from 'lucide-react'
import { noticeKinds } from '@/data/notices'
import { uiCopy } from '@/config/ui-copy'
import { formatDate } from '@/lib/format'
import type { Notice } from '@/types/content'
import { IconBadge, type IconBadgeTone } from '@/components/atoms/icon-badge'

const toneByKind: Record<Notice['kind'], IconBadgeTone> = {
  comunicado: 'primary',
  simulacro: 'warning',
  taller: 'success',
}

export function NoticeCard({ notice }: { notice: Notice }) {
  const kind = noticeKinds.find((item) => item.id === notice.kind)
  const details = [
    { icon: Calendar, label: uiCopy.notices.date, value: formatDate(notice.date) },
    notice.time && { icon: Clock, label: uiCopy.notices.time, value: notice.time },
    notice.place && { icon: MapPin, label: uiCopy.notices.place, value: notice.place },
  ].filter(Boolean) as Array<{ icon: typeof Calendar; label: string; value: string }>

  return (
    <article className="flex gap-4 rounded-2xl border border-border bg-card p-4 md:p-5">
      {kind && <IconBadge name={kind.icon} tone={toneByKind[notice.kind]} />}
      <div className="flex flex-1 flex-col gap-2">
        {kind && <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{kind.label}</p>}
        <h3 className="text-pretty text-lg font-bold leading-snug text-card-foreground">{notice.title}</h3>
        <p className="text-base leading-relaxed text-muted-foreground">{notice.summary}</p>
        <dl className="flex flex-col gap-1.5 pt-1 text-base">
          {details.map(({ icon: DetailIcon, label, value }) => (
            <div key={label} className="flex items-start gap-2">
              <dt className="sr-only">{label}</dt>
              <DetailIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
              <dd className="first-letter:uppercase text-card-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  )
}
