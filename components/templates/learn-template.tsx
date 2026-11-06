import { pageCopy } from '@/config/site'
import { uiCopy } from '@/config/ui-copy'
import type { Risk } from '@/types/content'
import { KitProgress } from '@/components/molecules/kit-progress'
import { LandingSection } from '@/components/molecules/landing-section'
import { MapAccessCard } from '@/components/molecules/map-access-card'
import { RiskGrid } from '@/components/organisms/risk-grid'
import { SectionTemplate } from '@/components/templates/section-template'

export function LearnTemplate({ risks, hasMap }: { risks: Risk[]; hasMap: boolean }) {
  return (
    <SectionTemplate copy={pageCopy.learn} icon="book">
      <LandingSection id="riesgos" title={uiCopy.learn.risksTitle} icon="alert">
        <RiskGrid risks={risks} />
      </LandingSection>
      {hasMap && (
        <LandingSection id="mapa" title={uiCopy.learn.mapTitle} icon="map">
          <MapAccessCard />
        </LandingSection>
      )}
      <LandingSection id="prepararse" title={uiCopy.learn.preparedTitle} icon="backpack">
        <p className="text-base leading-relaxed text-muted-foreground">{uiCopy.learn.preparedIntro}</p>
        <KitProgress />
      </LandingSection>
    </SectionTemplate>
  )
}
