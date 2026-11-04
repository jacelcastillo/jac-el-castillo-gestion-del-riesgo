import { CalendarDays, User } from 'lucide-react'
import { uiCopy } from '@/config/ui-copy'
import type { AboutContent } from '@/types/content'
import { IconBadge } from '@/components/atoms/icon-badge'
import { SectionHeading } from '@/components/atoms/section-heading'

export function AboutSections({ about }: { about: AboutContent }) {
  const statements = [
    { id: 'mision', title: uiCopy.about.mission, text: about.mission, icon: 'target' as const },
    { id: 'vision', title: uiCopy.about.vision, text: about.vision, icon: 'eye' as const },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2">
        {statements.map((statement) => (
          <section key={statement.id} aria-labelledby={statement.id} className="flex flex-col gap-2 rounded-2xl bg-card p-5 border border-border">
            <SectionHeading id={statement.id} icon={statement.icon}>
              {statement.title}
            </SectionHeading>
            <p className="text-base leading-relaxed text-card-foreground">{statement.text}</p>
          </section>
        ))}
      </div>

      <section aria-labelledby="comite" className="flex flex-col gap-3">
        <SectionHeading id="comite" icon="users">
          {about.committee.title}
        </SectionHeading>
        <p className="text-base leading-relaxed text-muted-foreground">{about.committee.description}</p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {about.committee.members.map((member) => (
            <li key={member.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User aria-hidden="true" className="size-6" />
              </span>
              <div>
                <p className="text-base font-bold text-card-foreground">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="participa" className="flex flex-col gap-3">
        <SectionHeading id="participa" icon="handshake">
          {about.participate.title}
        </SectionHeading>
        <p className="text-base leading-relaxed text-muted-foreground">{about.participate.description}</p>
        <ul className="grid gap-3 md:grid-cols-3">
          {about.participate.ways.map((way) => (
            <li key={way.id} className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5">
              <IconBadge name={way.icon} tone="success" />
              <h3 className="text-lg font-bold text-card-foreground">{way.title}</h3>
              <p className="text-base leading-relaxed text-muted-foreground">{way.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <aside className="flex items-start gap-3 rounded-2xl bg-primary p-5 text-primary-foreground">
        <CalendarDays aria-hidden="true" className="size-7 shrink-0" />
        <div>
          <p className="text-lg font-bold">{about.meeting.title}</p>
          <p className="text-base leading-relaxed opacity-95">{about.meeting.detail}</p>
        </div>
      </aside>
    </div>
  )
}
