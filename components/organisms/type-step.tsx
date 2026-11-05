import { useFormContext } from 'react-hook-form'
import { incidentTypes } from '@/config/incident'
import type { IncidentDraft } from '@/types/incident'
import { OptionCard } from '@/components/molecules/option-card'
import { OptionGroup } from '@/components/molecules/option-group'

export function TypeStep({ title }: { title: string }) {
  const { register, formState } = useFormContext<IncidentDraft>()
  const error = formState.errors.type?.message
  return (
    <OptionGroup name="type" legend={title} hideLegend error={error} className="sm:grid-cols-2">
      {incidentTypes.map((option) => (
        <OptionCard
          key={option.id}
          value={option.id}
          label={option.label}
          description={option.description}
          icon={option.icon}
          aria-invalid={error ? true : undefined}
          {...register('type')}
        />
      ))}
    </OptionGroup>
  )
}
