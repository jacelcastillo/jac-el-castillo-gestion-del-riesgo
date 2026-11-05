import Link from 'next/link'
import { useFormContext } from 'react-hook-form'
import { incidentTypes, peopleAffectedOptions, severityOptions } from '@/config/incident'
import { uiCopy } from '@/config/ui-copy'
import { describeLocation } from '@/lib/incident-format'
import type { IncidentDraft } from '@/types/incident'
import { CheckField } from '@/components/molecules/check-field'
import { LifeRiskBanner } from '@/components/molecules/life-risk-banner'
import { SummaryRow } from '@/components/molecules/summary-row'

const labelOf = (options: { id: string; label: string }[], id: string) => options.find((option) => option.id === id)?.label

export function ReviewStep({ onEdit }: { onEdit: (stepId: string) => void }) {
  const { register, watch, formState } = useFormContext<IncidentDraft>()
  const copy = uiCopy.report
  const values = watch()
  const contact = values.contact.anonymous
    ? copy.anonymous
    : [values.contact.name, values.contact.phone].filter(Boolean).join(' · ')
  const lifeRisk = values.severity === 'alta' || values.peopleAffected === 'si'

  return (
    <div className="flex flex-col gap-6">
      {lifeRisk && <LifeRiskBanner />}
      <dl className="rounded-2xl border border-border bg-card px-4">
        <SummaryRow label={copy.summaryLabels.type} onEdit={() => onEdit('tipo')}>
          {labelOf(incidentTypes, values.type)}
        </SummaryRow>
        <SummaryRow label={copy.summaryLabels.location} onEdit={() => onEdit('ubicacion')}>
          {describeLocation(values.location)}
        </SummaryRow>
        <SummaryRow label={copy.summaryLabels.description} onEdit={() => onEdit('detalles')}>
          {values.description}
        </SummaryRow>
        <SummaryRow label={copy.summaryLabels.severity} onEdit={() => onEdit('detalles')}>
          {labelOf(severityOptions, values.severity)}
        </SummaryRow>
        <SummaryRow label={copy.summaryLabels.people} onEdit={() => onEdit('detalles')}>
          {labelOf(peopleAffectedOptions, values.peopleAffected)}
        </SummaryRow>
        <SummaryRow label={copy.summaryLabels.photo} onEdit={() => onEdit('foto')}>
          {values.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={values.photo.dataUrl} alt={copy.photoAlt} className="h-24 rounded-lg object-cover" />
          ) : (
            copy.noPhoto
          )}
        </SummaryRow>
        <SummaryRow label={copy.summaryLabels.contact} onEdit={() => onEdit('contacto')}>
          {contact}
        </SummaryRow>
      </dl>
      <CheckField
        id="consent"
        label={copy.consentLabel}
        error={formState.errors.consent?.message}
        {...register('consent')}
      />
      <Link
        href="/privacidad"
        target="_blank"
        rel="noopener"
        className="inline-flex min-h-11 items-center self-start text-base font-semibold text-primary underline underline-offset-4 outline-none focus-visible:ring-4 focus-visible:ring-ring/50"
      >
        {copy.consentPrivacy}
        <span className="sr-only">{copy.opensInNewTab}</span>
      </Link>
    </div>
  )
}
