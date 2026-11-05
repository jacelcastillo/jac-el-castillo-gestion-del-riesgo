import type { Metadata } from 'next'
import { contactGroups, contacts } from '@/config/contacts'
import { pageCopy } from '@/config/site'
import { contentService } from '@/lib/services/content-service'
import { ContactsDirectory } from '@/components/organisms/contacts-directory'
import { SectionTemplate } from '@/components/templates/section-template'

export const metadata: Metadata = { title: pageCopy.contacts.title }
export const dynamic = 'force-dynamic'

export default async function ContactsPage() {
  const wpContacts = await contentService.getContacts()
  return (
    <SectionTemplate copy={pageCopy.contacts} icon="phone">
      <ContactsDirectory contacts={[...contacts, ...wpContacts]} groups={contactGroups} />
    </SectionTemplate>
  )
}
