import { Calendar, Clock, MapPin } from 'lucide-react'
import { noticeKinds } from '@/config/notices'
import { uiCopy } from '@/config/ui-copy'
import { formatDate, formatShortDate } from '@/lib/format'
import type { Notice } from '@/types/content'
import { IconBadge, type IconBadgeTone } from '@/components/atoms/icon-badge'

const toneByKind: Record<Notice['kind'], IconBadgeTone> = {
  comunicado: 'primary',
  simulacro: 'warning',
  taller: 'success',
}

export function NoticeCard({
  notice,
  headingLevel: Heading = 'h3',
}: {
  notice: Notice
  headingLevel?: 'h2' | 'h3'
}) {
  const kind = noticeKinds.find((item) => item.id === notice.kind)
  const details = [
    !notice.published && { icon: Calendar, label: uiCopy.notices.date, value: formatDate(notice.date) },
    notice.time && { icon: Clock, label: uiCopy.notices.time, value: notice.time },
    notice.place && { icon: MapPin, label: uiCopy.notices.place, value: notice.place },
  ].filter(Boolean) as Array<{ icon: typeof Calendar; label: string; value: string }>

  return (
    <article className="flex gap-4 rounded-2xl border border-border bg-card p-4 md:p-5">
      {kind && <IconBadge name={kind.icon} tone={toneByKind[notice.kind]} />}
      <div className="flex flex-1 flex-col gap-2">
        {kind && <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{kind.label}</p>}
        <Heading className="text-pretty text-lg font-bold leading-snug text-card-foreground">{notice.title}</Heading>
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
        {notice.published && (
          <p className="text-sm text-muted-foreground">
            {uiCopy.notices.published} {formatShortDate(notice.date)}
          </p>
        )}
        <a
          href={notice.href}
          rel="noopener"
          className="inline-flex min-h-11 items-center self-start text-base font-semibold text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-4 focus-visible:ring-ring/50"
        >
          {uiCopy.notices.readMore}
        </a>
      </div>
    </article>
  )
}
