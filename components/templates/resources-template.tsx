import { pageCopy } from '@/config/site'
import type { Resource } from '@/types/content'
import { ResourceList } from '@/components/organisms/resource-list'
import { SectionTemplate } from '@/components/templates/section-template'

/** `resources` es `null` cuando no se pudieron cargar. */
export function ResourcesTemplate({ resources }: { resources: Resource[] | null }) {
  return (
    <SectionTemplate copy={pageCopy.resources} icon="fileText">
      <ResourceList resources={resources} />
    </SectionTemplate>
  )
}
