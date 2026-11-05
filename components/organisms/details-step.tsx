import { useFormContext } from 'react-hook-form'
import { peopleAffectedOptions, severityOptions } from '@/config/incident'
import { uiCopy } from '@/config/ui-copy'
import type { IncidentDraft } from '@/types/incident'
import { fieldA11y, FormField } from '@/components/molecules/form-field'
import { OptionCard } from '@/components/molecules/option-card'
import { OptionGroup } from '@/components/molecules/option-group'
import { Textarea } from '@/components/ui/textarea'

const MAX_DESCRIPTION = 600

export function DetailsStep() {
  const { register, watch, formState } = useFormContext<IncidentDraft>()
  const { errors } = formState
  const copy = uiCopy.report
  const descriptionError = errors.description?.message
  const used = (watch('description') ?? '').length

  return (
    <div className="flex flex-col gap-6">
      <FormField id="description" label={copy.descriptionLabel} hint={copy.characters(used, MAX_DESCRIPTION)} error={descriptionError}>
        <Textarea
          {...fieldA11y('description', { hint: copy.characters(used, MAX_DESCRIPTION), error: descriptionError })}
          rows={5}
          placeholder={copy.descriptionPlaceholder}
          className="min-h-36 px-3 py-3 text-base md:text-base"
          {...register('description')}
        />
      </FormField>
      <OptionGroup name="severity" legend={copy.severityLabel} error={errors.severity?.message} className="sm:grid-cols-3">
        {severityOptions.map((option) => (
          <OptionCard
            key={option.id}
            value={option.id}
            label={option.label}
            description={option.description}
            aria-invalid={errors.severity ? true : undefined}
            {...register('severity')}
          />
        ))}
      </OptionGroup>
      <OptionGroup name="peopleAffected" legend={copy.peopleLabel} error={errors.peopleAffected?.message} className="grid-cols-3">
        {peopleAffectedOptions.map((option) => (
          <OptionCard
            key={option.id}
            value={option.id}
            label={option.label}
            aria-invalid={errors.peopleAffected ? true : undefined}
            {...register('peopleAffected')}
          />
        ))}
      </OptionGroup>
    </div>
  )
}
