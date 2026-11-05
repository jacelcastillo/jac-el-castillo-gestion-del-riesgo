import type { Contact, ContactGroup } from '@/types/content'
import { ContactCard } from '@/components/molecules/contact-card'

export function ContactsDirectory({ contacts, groups }: { contacts: Contact[]; groups: ContactGroup[] }) {
  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => {
        const groupContacts = contacts.filter((contact) => contact.group === group.id)
        if (groupContacts.length === 0) return null
        const headingId = `grupo-${group.id}`
        return (
          <section key={group.id} aria-labelledby={headingId} className="flex flex-col gap-3">
            <div>
              <h2 id={headingId} className="text-2xl font-bold text-foreground">
                {group.title}
              </h2>
              <p className="text-base text-muted-foreground">{group.description}</p>
            </div>
            <ul className="grid gap-3 lg:grid-cols-2">
              {groupContacts.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
