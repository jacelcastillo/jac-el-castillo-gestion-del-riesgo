import { useFormContext } from 'react-hook-form'
import { uiCopy } from '@/config/ui-copy'
import type { IncidentDraft } from '@/types/incident'
import { PhotoField } from '@/components/molecules/photo-field'

export function PhotoStep() {
  const { watch, setValue } = useFormContext<IncidentDraft>()
  return (
    <PhotoField
      value={watch('photo')}
      onChange={(photo) => setValue('photo', photo, { shouldDirty: true })}
      hint={uiCopy.report.photoHint}
    />
  )
}
