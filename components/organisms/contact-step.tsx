import { useFormContext } from 'react-hook-form'
import { uiCopy } from '@/config/ui-copy'
import type { IncidentDraft } from '@/types/incident'
import { CheckField } from '@/components/molecules/check-field'
import { fieldA11y, FormField } from '@/components/molecules/form-field'
import { Input } from '@/components/ui/input'

const inputClass = 'h-12 px-3 text-base md:text-base'

export function ContactStep() {
  const { register, watch, clearErrors, formState } = useFormContext<IncidentDraft>()
  const copy = uiCopy.report
  const anonymous = watch('contact.anonymous')
  const nameError = formState.errors.contact?.name?.message
  const phoneError = formState.errors.contact?.phone?.message

  return (
    <div className="flex flex-col gap-6">
      <CheckField
        id="contact-anonymous"
        label={copy.anonymousLabel}
        hint={copy.anonymousHint}
        {...register('contact.anonymous', { onChange: (event) => event.target.checked && clearErrors('contact') })}
      />
      {!anonymous && (
        <>
          <FormField id="contact-name" label={copy.nameLabel} error={nameError}>
            <Input
              {...fieldA11y('contact-name', { error: nameError })}
              autoComplete="name"
              className={inputClass}
              {...register('contact.name')}
            />
          </FormField>
          <FormField id="contact-phone" label={copy.phoneLabel} error={phoneError}>
            <Input
              {...fieldA11y('contact-phone', { error: phoneError })}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={copy.phonePlaceholder}
              className={inputClass}
              {...register('contact.phone')}
            />
          </FormField>
        </>
      )}
    </div>
  )
}
