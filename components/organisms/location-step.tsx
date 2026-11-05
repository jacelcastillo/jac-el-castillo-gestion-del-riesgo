import { CheckCircle2, LocateFixed } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { uiCopy } from '@/config/ui-copy'
import { useGeolocation } from '@/hooks/use-geolocation'
import type { IncidentDraft } from '@/types/incident'
import { FieldError } from '@/components/atoms/field-error'
import { fieldA11y, FormField } from '@/components/molecules/form-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const inputClass = 'h-12 px-3 text-base md:text-base'

export function LocationStep() {
  const { register, setValue, getValues, watch, formState } = useFormContext<IncidentDraft>()
  const { state, locate } = useGeolocation()
  const copy = uiCopy.report
  const location = watch('location')
  const addressError = formState.errors.location?.address?.message ?? formState.errors.location?.message

  async function useMyLocation() {
    const coords = await locate()
    if (!coords) return
    setValue('location', { ...getValues('location'), mode: 'gps', ...coords }, { shouldValidate: true })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Button type="button" variant="outline" size="xl" onClick={useMyLocation} disabled={state.status === 'locating'}>
          <LocateFixed aria-hidden="true" />
          {state.status === 'locating' ? copy.locating : copy.useMyLocation}
        </Button>
        <div aria-live="polite" className="flex flex-col gap-1">
          {location.latitude !== undefined && state.status !== 'locating' && (
            <p className="flex items-center gap-2 text-base font-semibold text-success">
              <CheckCircle2 aria-hidden="true" className="size-5 shrink-0" />
              {copy.locationFound}
              {location.accuracy !== undefined && (
                <span className="font-normal text-muted-foreground">{copy.accuracy(location.accuracy)}</span>
              )}
            </p>
          )}
          {state.status === 'error' && <FieldError id="gps-error" message={state.message} />}
        </div>
      </div>
      <p className="text-base font-semibold text-muted-foreground">{copy.orWriteAddress}</p>
      <FormField id="location-address" label={copy.addressLabel} error={addressError}>
        <Input
          {...fieldA11y('location-address', { error: addressError })}
          autoComplete="street-address"
          placeholder={copy.addressPlaceholder}
          className={inputClass}
          {...register('location.address')}
        />
      </FormField>
      <FormField id="location-reference" label={copy.referenceLabel}>
        <Input
          id="location-reference"
          placeholder={copy.referencePlaceholder}
          className={inputClass}
          {...register('location.reference')}
        />
      </FormField>
    </div>
  )
}
