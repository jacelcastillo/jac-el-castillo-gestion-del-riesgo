import type { Metadata } from 'next'
import { contactGroups, contacts } from '@/config/contacts'
import { pageCopy } from '@/config/site'
import { ContactsDirectory } from '@/components/organisms/contacts-directory'
import { SectionTemplate } from '@/components/templates/section-template'

export const metadata: Metadata = { title: pageCopy.contacts.title }

export default function ContactsPage() {
  return (
    <SectionTemplate copy={pageCopy.contacts} icon="phone">
      <ContactsDirectory contacts={contacts} groups={contactGroups} />
    </SectionTemplate>
  )
}
