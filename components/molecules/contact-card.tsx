import { uiCopy } from '@/config/ui-copy'
import { cn } from '@/lib/utils'
import type { Contact } from '@/types/content'
import { CallLink } from '@/components/atoms/call-link'
import { IconBadge } from '@/components/atoms/icon-badge'

export function ContactCard({ contact }: { contact: Contact }) {
  const isEmergency = contact.priority === 'emergencia'
  return (
    <li
      className={cn(
        'flex flex-col gap-4 rounded-2xl border-2 bg-card p-4 sm:flex-row sm:items-center',
        isEmergency ? 'border-destructive' : 'border-border',
      )}
    >
      <div className="flex flex-1 items-center gap-4">
        <IconBadge name={contact.icon} tone={isEmergency ? 'danger' : 'primary'} size="lg" />
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-card-foreground">{contact.name}</h3>
          <p className="text-base text-muted-foreground">{contact.role}</p>
          <p className="text-xl font-bold tabular-nums text-card-foreground">{contact.displayPhone}</p>
        </div>
      </div>
      <CallLink
        phone={contact.phone}
        accessibleLabel={`${uiCopy.contacts.call} a ${contact.name}, ${contact.displayPhone}`}
        tone={isEmergency || contact.group === 'nacional' ? 'emergency' : 'primary'}
        size="lg"
        className="w-full sm:w-auto"
      >
        {uiCopy.contacts.call}
      </CallLink>
    </li>
  )
}
