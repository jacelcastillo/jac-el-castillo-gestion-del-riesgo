import Link from 'next/link'
import { uiCopy } from '@/config/ui-copy'
import type { AlertStatus, Contact, PageCopy } from '@/types/content'
import { AlertBanner } from '@/components/organisms/alert-banner'
import { CallLink } from '@/components/atoms/call-link'
import { LifeRiskBanner } from '@/components/molecules/life-risk-banner'

interface LandingHeroProps {
  copy: PageCopy
  alert: AlertStatus | null
  phones: Contact[]
}

export function LandingHero({ copy, alert, phones }: LandingHeroProps) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-balance text-3xl font-bold leading-tight text-foreground md:text-4xl">{copy.title}</h1>
        <p className="text-pretty text-lg leading-relaxed text-muted-foreground">{copy.intro}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <AlertBanner alert={alert} />
        <div className="flex flex-col gap-3">
          <LifeRiskBanner />
          {phones.length > 0 && (
            <div className="hidden flex-1 flex-col justify-between gap-2 rounded-2xl border border-border bg-card p-4 lg:flex">
              <ul className="flex flex-col gap-2">
                {phones.map((phone) => (
                  <li key={phone.id} className="flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-card-foreground">{phone.name}</span>
                      <span className="text-xl font-bold tabular-nums text-card-foreground">{phone.displayPhone}</span>
                    </div>
                    <CallLink
                      phone={phone.phone}
                      accessibleLabel={`${uiCopy.contacts.call} a ${phone.name}, ${phone.displayPhone}`}
                      tone="outline"
                    >
                      {uiCopy.contacts.call}
                    </CallLink>
                  </li>
                ))}
              </ul>
              <Link
                href="/contactos"
                className="inline-flex min-h-11 items-center self-start text-base font-semibold text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-4 focus-visible:ring-ring/50"
              >
                {uiCopy.home.seeAllPhones}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
