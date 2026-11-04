import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { uiCopy } from '@/config/ui-copy'
import type { Notice } from '@/types/content'
import { SectionHeading } from '@/components/atoms/section-heading'
import { NoticeCard } from '@/components/molecules/notice-card'

export function LatestNotices({ notices }: { notices: Notice[] }) {
  return (
    <section aria-labelledby="ultimos-avisos" className="flex flex-col gap-4">
      <SectionHeading id="ultimos-avisos" icon="megaphone">
        {uiCopy.home.latestNoticesTitle}
      </SectionHeading>
      <ul className="flex flex-col gap-3">
        {notices.map((notice) => (
          <li key={notice.id}>
            <NoticeCard notice={notice} />
          </li>
        ))}
      </ul>
      <Link
        href="/avisos"
        className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl px-1 text-lg font-bold text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-4 focus-visible:ring-ring/50"
      >
        {uiCopy.home.seeAllNotices}
        <ArrowRight aria-hidden="true" className="size-5" />
      </Link>
    </section>
  )
}
