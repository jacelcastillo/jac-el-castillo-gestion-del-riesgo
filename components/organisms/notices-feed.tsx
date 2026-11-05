'use client'

import { useState } from 'react'
import { noticeKinds } from '@/config/notices'
import { uiCopy } from '@/config/ui-copy'
import { cn } from '@/lib/utils'
import type { Notice, NoticeKind } from '@/types/content'
import { Icon } from '@/components/atoms/icon'
import { NoticeCard } from '@/components/molecules/notice-card'

type Filter = NoticeKind | 'todos'

export function NoticesFeed({ notices }: { notices: Notice[] }) {
  const [filter, setFilter] = useState<Filter>('todos')
  const visible = filter === 'todos' ? notices : notices.filter((notice) => notice.kind === filter)
  const filters: Array<{ id: Filter; label: string }> = [
    { id: 'todos', label: uiCopy.notices.all },
    ...noticeKinds.map((kind) => ({ id: kind.id, label: kind.label })),
  ]

  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label={uiCopy.notices.filterLabel} className="flex flex-wrap gap-2">
        {filters.map((item) => {
          const kind = noticeKinds.find((k) => k.id === item.id)
          const active = filter === item.id
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(item.id)}
              className={cn(
                'inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-4 text-base font-semibold transition-colors outline-none focus-visible:ring-4 focus-visible:ring-ring/50',
                active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-foreground hover:border-primary',
              )}
            >
              {kind && <Icon name={kind.icon} className="size-5" />}
              {item.label}
            </button>
          )
        })}
      </div>
      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-6 text-center text-lg text-muted-foreground">
          {uiCopy.notices.empty}
        </p>
      ) : (
        <ul className="flex flex-col gap-3" aria-live="polite">
          {visible.map((notice) => (
            <li key={notice.id}>
              <NoticeCard notice={notice} headingLevel="h2" />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
