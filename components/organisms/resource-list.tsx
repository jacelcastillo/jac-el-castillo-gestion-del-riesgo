import { uiCopy } from '@/config/ui-copy'
import type { Resource } from '@/types/content'
import { ResourceCard } from '@/components/molecules/resource-card'

const messageClass = 'rounded-xl border border-border bg-card p-4 text-base text-card-foreground'

/** `resources` es `null` cuando no se pudieron cargar. */
export function ResourceList({ resources }: { resources: Resource[] | null }) {
  if (resources === null) {
    return (
      <p role="status" className={messageClass}>
        {uiCopy.resources.unavailable}
      </p>
    )
  }
  if (resources.length === 0) return <p className={messageClass}>{uiCopy.resources.empty}</p>

  return (
    <div className="flex flex-col gap-4">
      <p className="text-base text-muted-foreground">{uiCopy.resources.offlineHint}</p>
      <ul aria-label={uiCopy.resources.listLabel} className="flex flex-col gap-3">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </ul>
    </div>
  )
}
