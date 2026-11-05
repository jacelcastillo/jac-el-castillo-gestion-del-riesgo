'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { KIT_STORAGE_KEY, kitItemIds } from '@/config/preparedness'
import { uiCopy } from '@/config/ui-copy'
import { useChecklist } from '@/hooks/use-checklist'
import { ProgressMeter } from '@/components/molecules/progress-meter'

/** Avance del kit de emergencia; lee el mismo guardado que la página Prepárate. */
export function KitProgress() {
  const kit = useChecklist(KIT_STORAGE_KEY, kitItemIds)
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      <ProgressMeter
        label={uiCopy.home.kitProgressLabel}
        value={kit.doneCount}
        max={kit.total}
        valueLabel={`${kit.doneCount} ${uiCopy.home.kitOf} ${kit.total}`}
      />
      <Link
        href="/preparate"
        className="inline-flex min-h-11 items-center gap-2 self-start rounded-lg text-base font-bold text-primary outline-none hover:underline focus-visible:ring-4 focus-visible:ring-ring/50"
      >
        {uiCopy.home.kitContinue}
        <ArrowRight aria-hidden="true" className="size-5" />
      </Link>
    </div>
  )
}
