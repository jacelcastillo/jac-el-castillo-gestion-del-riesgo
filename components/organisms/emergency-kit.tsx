'use client'

import { PartyPopper, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { KIT_STORAGE_KEY, kitItemIds } from '@/config/preparedness'
import { uiCopy } from '@/config/ui-copy'
import { useChecklist } from '@/hooks/use-checklist'
import type { KitCategory } from '@/types/content'
import { SectionHeading } from '@/components/atoms/section-heading'
import { CheckItem } from '@/components/molecules/check-item'
import { ProgressMeter } from '@/components/molecules/progress-meter'

export function EmergencyKit({ categories }: { categories: KitCategory[] }) {
  const kit = useChecklist(KIT_STORAGE_KEY, kitItemIds)

  return (
    <section aria-labelledby="kit-emergencia" className="flex flex-col gap-4">
      <SectionHeading id="kit-emergencia" icon="backpack">
        {uiCopy.prepare.kitTitle}
      </SectionHeading>
      <p className="text-base leading-relaxed text-muted-foreground">{uiCopy.prepare.kitIntro}</p>
      <div className="sticky top-0 z-10 -mx-1 rounded-xl bg-background/95 p-1 backdrop-blur">
        <ProgressMeter label={uiCopy.prepare.progressLabel} value={kit.doneCount} max={kit.total} />
      </div>
      {kit.isComplete && (
        <p role="status" className="flex items-center gap-3 rounded-2xl bg-success p-4 text-lg font-bold text-success-foreground">
          <PartyPopper aria-hidden="true" className="size-7 shrink-0" />
          {uiCopy.prepare.ready}
        </p>
      )}
      {categories.map((category) => (
        <fieldset key={category.id} className="flex flex-col gap-2">
          <legend className="mb-2 text-lg font-bold text-foreground">{category.title}</legend>
          <ul className="flex flex-col gap-2">
            {category.items.map((item) => (
              <CheckItem
                key={item.id}
                id={item.id}
                label={item.label}
                hint={item.hint}
                checked={kit.isChecked(item.id)}
                onToggle={() => kit.toggle(item.id)}
              />
            ))}
          </ul>
        </fieldset>
      ))}
      {kit.doneCount > 0 && (
        <Button type="button" variant="outline" size="touch" onClick={kit.reset} className="self-start">
          <RotateCcw aria-hidden="true" />
          {uiCopy.prepare.reset}
        </Button>
      )}
    </section>
  )
}
