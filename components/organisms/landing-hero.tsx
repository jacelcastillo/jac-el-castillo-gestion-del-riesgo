import type { PageCopy } from '@/types/content'
import { LifeRiskBanner } from '@/components/molecules/life-risk-banner'

export function LandingHero({ copy }: { copy: PageCopy }) {
  return (
    <section className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <div className="flex flex-col gap-4">
        <h1 className="text-balance text-3xl font-bold leading-tight text-foreground md:text-4xl">{copy.title}</h1>
        <p className="text-pretty text-lg leading-relaxed text-muted-foreground">{copy.intro}</p>
      </div>
      <div className="flex flex-col gap-4">
        <LifeRiskBanner />
      </div>
    </section>
  )
}
