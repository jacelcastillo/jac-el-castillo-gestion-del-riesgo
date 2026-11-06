import { pageCopy } from '@/config/site'
import { uiCopy } from '@/config/ui-copy'
import type { Risk } from '@/types/content'
import { AccessCard } from '@/components/molecules/access-card'
import { KitProgress } from '@/components/molecules/kit-progress'
import { LandingSection } from '@/components/molecules/landing-section'
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
          <AccessCard href="/mapa" icon="map" title={uiCopy.learn.mapOpen} description={pageCopy.map.intro} />
        </LandingSection>
      )}
      <LandingSection id="recursos" title={uiCopy.learn.resourcesTitle} icon="fileText">
        <AccessCard href="/recursos" icon="fileText" title={uiCopy.learn.resourcesOpen} description={pageCopy.resources.intro} />
      </LandingSection>
      <LandingSection id="prepararse" title={uiCopy.learn.preparedTitle} icon="backpack">
        <p className="text-base leading-relaxed text-muted-foreground">{uiCopy.learn.preparedIntro}</p>
        <KitProgress />
      </LandingSection>
    </SectionTemplate>
  )
}
