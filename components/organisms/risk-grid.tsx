import type { Risk } from '@/types/content'
import { RiskCard } from '@/components/molecules/risk-card'

export function RiskGrid({ risks }: { risks: Risk[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {risks.map((risk) => (
        <li key={risk.slug}>
          <RiskCard risk={risk} />
        </li>
      ))}
    </ul>
  )
}
