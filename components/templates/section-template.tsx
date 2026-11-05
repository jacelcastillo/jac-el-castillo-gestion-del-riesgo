import type { ReactNode } from 'react'
import type { IconName } from '@/lib/icons'
import type { PageCopy } from '@/types/content'
import { PageHeader } from '@/components/molecules/page-header'

export function SectionTemplate({ copy, icon, children }: { copy: PageCopy; icon?: IconName; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader copy={copy} icon={icon} />
      {children}
    </div>
  )
}
