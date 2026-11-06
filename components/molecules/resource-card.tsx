import { ExternalLink } from 'lucide-react'
import { resourceFormats } from '@/config/resources'
import { uiCopy } from '@/config/ui-copy'
import { formatFileSize } from '@/lib/format'
import type { Resource } from '@/types/content'
import { IconBadge } from '@/components/atoms/icon-badge'

export function ResourceCard({ resource }: { resource: Resource }) {
  const format = resourceFormats[resource.format]
  const summary = `${format.label}, ${formatFileSize(resource.sizeBytes)}`

  return (
    <li className="flex gap-3 rounded-xl border border-border bg-card p-4">
      <IconBadge name={format.icon} />
      <div className="flex min-w-0 flex-col gap-1">
        <h2 className="text-lg font-bold text-card-foreground">{resource.title}</h2>
        {resource.description && <p className="text-base leading-relaxed text-muted-foreground">{resource.description}</p>}
        <p className="text-base text-muted-foreground">{summary}</p>
        <a
          href={resource.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex min-h-11 w-fit items-center gap-1.5 rounded-lg px-2 text-base font-semibold text-primary outline-none hover:underline focus-visible:ring-4 focus-visible:ring-ring/50"
        >
          {format.action}
          <ExternalLink aria-hidden="true" className="size-4" />
          <span className="sr-only">
            {' '}
            {resource.title} {uiCopy.resources.opensInNewTab}
          </span>
        </a>
      </div>
    </li>
  )
}
