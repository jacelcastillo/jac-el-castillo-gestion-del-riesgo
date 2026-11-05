import { aboutContent } from '@/config/about'
import { pageCopy } from '@/config/site'
import { uiCopy } from '@/config/ui-copy'
import type { AlertStatus, CommitteeMember, Contact, Notice } from '@/types/content'
import { LandingHero } from '@/components/organisms/landing-hero'
import { LatestNotices } from '@/components/organisms/latest-notices'
import { LandingSection } from '@/components/molecules/landing-section'
import { ContactCard } from '@/components/molecules/contact-card'

const FEATURED_CONTACTS = 3

interface HomeTemplateProps {
  alert: AlertStatus | null
  notices: Notice[]
  contacts: Contact[]
  committee: CommitteeMember[]
}

export function HomeTemplate({ alert, notices, contacts, committee }: HomeTemplateProps) {
  return (
    <div className="flex flex-col gap-10">
      <LandingHero copy={pageCopy.home} alert={alert} />
      <LatestNotices notices={notices} />
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
      <LandingSection
        id="la-jac"
        title={uiCopy.home.aboutTitle}
        icon="users"
        seeAll={{ href: '/sobre-la-jac', label: uiCopy.home.seeMore }}
      >
        <p className="text-base leading-relaxed text-muted-foreground">{aboutContent.mission}</p>
        {committee.length > 0 && (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {committee.map((member) => (
              <li key={member.id} className="rounded-xl border border-border bg-card p-4">
                <p className="text-base font-bold text-card-foreground">{member.name}</p>
                {member.role && <p className="text-sm text-muted-foreground">{member.role}</p>}
              </li>
            ))}
          </ul>
        )}
      </LandingSection>
    </div>
  )
}
