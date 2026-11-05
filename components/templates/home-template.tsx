import { pageCopy } from '@/config/site'
import { uiCopy } from '@/config/ui-copy'
import type { Contact } from '@/types/content'
import { LandingHero } from '@/components/organisms/landing-hero'
import { LandingSection } from '@/components/molecules/landing-section'
import { ContactCard } from '@/components/molecules/contact-card'

const FEATURED_CONTACTS = 3

export function HomeTemplate({ contacts }: { contacts: Contact[] }) {
  return (
    <div className="flex flex-col gap-10">
      <LandingHero copy={pageCopy.home} />
      <LandingSection
        id="telefonos"
        title={uiCopy.home.emergencyPhonesTitle}
        icon="phone"
        seeAll={{ href: '/contactos', label: uiCopy.home.seeAllPhones }}
      >
        <ul className="grid gap-3 lg:grid-cols-3">
          {contacts.slice(0, FEATURED_CONTACTS).map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </ul>
      </LandingSection>
    </div>
  )
}
