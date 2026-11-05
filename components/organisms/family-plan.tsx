'use client'

import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PLAN_STORAGE_KEY, planStepIds } from '@/config/preparedness'
import { uiCopy } from '@/config/ui-copy'
import { useChecklist } from '@/hooks/use-checklist'
import type { PlanStep } from '@/types/content'
import { IconBadge } from '@/components/atoms/icon-badge'
import { SectionHeading } from '@/components/atoms/section-heading'
import { CheckItem } from '@/components/molecules/check-item'
import { ProgressMeter } from '@/components/molecules/progress-meter'

export function FamilyPlan({ steps }: { steps: PlanStep[] }) {
  const plan = useChecklist(PLAN_STORAGE_KEY, planStepIds)

  return (
    <section aria-labelledby="plan-familiar" className="flex flex-col gap-4">
      <SectionHeading id="plan-familiar" icon="house">
        {uiCopy.prepare.planTitle}
      </SectionHeading>
      <p className="text-base leading-relaxed text-muted-foreground">{uiCopy.prepare.planIntro}</p>
      <ProgressMeter label={uiCopy.prepare.planProgressLabel} value={plan.doneCount} max={plan.total} />
      <ol className="flex flex-col gap-2">
        {steps.map((step, index) => (
          <CheckItem
            key={step.id}
            id={step.id}
            label={`${uiCopy.prepare.step} ${index + 1}: ${step.title}`}
            hint={step.description}
            checked={plan.isChecked(step.id)}
            onToggle={() => plan.toggle(step.id)}
            leading={<IconBadge name={step.icon} size="sm" className="hidden sm:inline-flex" />}
          />
        ))}
      </ol>
      {plan.doneCount > 0 && (
        <Button type="button" variant="outline" size="touch" onClick={plan.reset} className="self-start">
          <RotateCcw aria-hidden="true" />
          {uiCopy.prepare.reset}
        </Button>
      )}
    </section>
  )
}
