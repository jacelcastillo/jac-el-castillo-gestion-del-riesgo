import { Pencil } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { uiCopy } from '@/config/ui-copy'

interface SummaryRowProps {
  label: string
  children: ReactNode
  onEdit: () => void
}

export function SummaryRow({ label, children, onEdit }: SummaryRowProps) {
  return (
    <div className="flex items-start gap-3 border-b border-border py-3 last:border-b-0">
      <div className="flex flex-1 flex-col gap-0.5">
        <dt className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
        <dd className="text-base leading-relaxed text-card-foreground">{children}</dd>
      </div>
      <Button type="button" variant="ghost" size="touch" onClick={onEdit} aria-label={`${uiCopy.report.edit} ${label}`}>
        <Pencil aria-hidden="true" />
        <span className="hidden sm:inline">{uiCopy.report.edit}</span>
      </Button>
    </div>
  )
}
