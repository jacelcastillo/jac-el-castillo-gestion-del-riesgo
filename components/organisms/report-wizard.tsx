'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { FormProvider, useForm, type Resolver } from 'react-hook-form'
import { activeReportSteps } from '@/config/incident'
import { uiCopy } from '@/config/ui-copy'
import { useCreateIncident } from '@/hooks/use-incidents'
import { incidentSchema } from '@/lib/validation/incident-schema'
import type { IncidentDraft, IncidentReport } from '@/types/incident'
import { FieldError } from '@/components/atoms/field-error'
import { LifeRiskBanner } from '@/components/molecules/life-risk-banner'
import { StepperProgress } from '@/components/molecules/stepper-progress'
import { Button } from '@/components/ui/button'
import { ContactStep } from '@/components/organisms/contact-step'
import { DetailsStep } from '@/components/organisms/details-step'
import { LocationStep } from '@/components/organisms/location-step'
import { ReportSuccess } from '@/components/organisms/report-success'
import { ReviewStep } from '@/components/organisms/review-step'
import { TypeStep } from '@/components/organisms/type-step'

const defaultValues = {
  location: { mode: 'manual', address: '', reference: '' },
  description: '',
  contact: { anonymous: false, name: '', phone: '' },
  consent: false,
} satisfies Partial<IncidentDraft>

function toDraft(values: IncidentDraft): IncidentDraft {
  const { contact, ...rest } = values
  return {
    ...rest,
    contact: contact.anonymous
      ? { anonymous: true }
      : { anonymous: false, name: contact.name, phone: contact.phone?.replace(/\D/g, '') },
  }
}

export function ReportWizard() {
  const createIncident = useCreateIncident()
  const form = useForm<IncidentDraft>({
    // The schema requires consent: true while the empty form holds false.
    resolver: zodResolver(incidentSchema) as Resolver<IncidentDraft>,
    defaultValues,
  })
  const { trigger, handleSubmit, reset, formState } = form
  const [stepIndex, setStepIndex] = useState(0)
  const [result, setResult] = useState<IncidentReport | null>(null)
  const [saveFailed, setSaveFailed] = useState(false)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const hasMoved = useRef(false)

  const step = activeReportSteps[stepIndex]
  const isLast = stepIndex === activeReportSteps.length - 1

  useEffect(() => {
    if (hasMoved.current) titleRef.current?.focus()
  }, [stepIndex])

  function goTo(index: number) {
    hasMoved.current = true
    setStepIndex(index)
  }

  function submit() {
    return handleSubmit(
      async (values) => {
        setSaveFailed(false)
        try {
          setResult(await createIncident(toDraft(values)))
        } catch {
          setSaveFailed(true)
        }
      },
      (errors) => {
        const failing = activeReportSteps.findIndex((item) => item.fields.some((field) => field in errors))
        if (failing >= 0 && failing !== stepIndex) goTo(failing)
      },
    )()
  }

  async function advance() {
    if (isLast) return submit()
    if (await trigger(step.fields, { shouldFocus: true })) goTo(stepIndex + 1)
  }

  function startOver() {
    reset(defaultValues)
    setResult(null)
    setStepIndex(0)
  }

  if (result) return <ReportSuccess sent={result.status !== 'pendiente'} onNewReport={startOver} />

  return (
    <div className="flex flex-col gap-6">
      <LifeRiskBanner />
      <StepperProgress current={stepIndex} total={activeReportSteps.length} />
      <FormProvider {...form}>
        <form
          noValidate
          aria-label={uiCopy.report.stepsLabel}
          onSubmit={(event) => {
            event.preventDefault()
            void advance()
          }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-1">
            <h2 ref={titleRef} tabIndex={-1} className="text-2xl font-bold leading-tight outline-none">
              {step.title}
            </h2>
            <p className="text-lg text-muted-foreground">{step.description}</p>
          </div>
          {step.id === 'tipo' && <TypeStep title={step.title} />}
          {step.id === 'ubicacion' && <LocationStep />}
          {step.id === 'detalles' && <DetailsStep />}
          {step.id === 'contacto' && <ContactStep />}
          {step.id === 'resumen' && <ReviewStep onEdit={(id) => goTo(activeReportSteps.findIndex((item) => item.id === id))} />}
          {saveFailed && <FieldError id="save-error" message={uiCopy.report.submitError} />}
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            {stepIndex > 0 && (
              <Button type="button" variant="outline" size="xl" onClick={() => goTo(stepIndex - 1)}>
                {uiCopy.report.back}
              </Button>
            )}
            <Button type="submit" size="xl" disabled={formState.isSubmitting} className="sm:flex-1">
              {isLast ? (formState.isSubmitting ? uiCopy.report.submitting : uiCopy.report.submit) : uiCopy.report.next}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
