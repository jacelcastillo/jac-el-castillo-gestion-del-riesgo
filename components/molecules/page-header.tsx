import type { IconName } from '@/lib/icons'
import type { PageCopy } from '@/types/content'
import { IconBadge } from '@/components/atoms/icon-badge'

export function PageHeader({ copy, icon }: { copy: PageCopy; icon?: IconName }) {
  return (
    <header className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {icon && <IconBadge name={icon} tone="solid" size="lg" />}
        <h1 className="text-balance text-3xl font-bold leading-tight text-foreground md:text-4xl">{copy.title}</h1>
      </div>
      <p className="text-pretty text-lg leading-relaxed text-muted-foreground">{copy.intro}</p>
    </header>
  )
}
