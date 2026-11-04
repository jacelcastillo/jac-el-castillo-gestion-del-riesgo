import { Siren } from 'lucide-react'
import { uiCopy } from '@/config/ui-copy'
import { cn } from '@/lib/utils'
import { CallLink } from '@/components/atoms/call-link'

export function LifeRiskBanner({ className }: { className?: string }) {
  const { message, action, phone } = uiCopy.lifeRisk
  return (
    <aside
      aria-label={message}
      className={cn(
        'flex flex-col gap-3 rounded-2xl border-2 border-destructive bg-destructive/10 p-4 sm:flex-row sm:items-center',
        className,
      )}
    >
      <p className="flex flex-1 items-center gap-3 text-lg font-bold text-foreground">
        <Siren aria-hidden="true" className="size-7 shrink-0 text-destructive" />
        {message}
      </p>
      <CallLink phone={phone} accessibleLabel={action} tone="emergency" size="lg" className="w-full sm:w-auto">
        {action}
      </CallLink>
    </aside>
  )
}
