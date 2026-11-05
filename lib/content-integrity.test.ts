import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { emergencyKit, familyPlanSteps, kitItemIds, planStepIds } from '../config/preparedness.ts'
import { riskPhases } from '../config/risk-phases.ts'
import { risks } from '../config/risks.ts'

const MIN_ACTIONS = 3

function assertUnique(values: string[]) {
  assert.equal(new Set(values).size, values.length, `duplicados en ${values.join(', ')}`)
}

describe('content integrity', () => {
  it('risk slugs are unique', () => {
    assertUnique(risks.map((risk) => risk.slug))
  })

  it('every risk has at least 3 actions in each phase', () => {
    for (const risk of risks) {
      for (const phase of riskPhases) {
        assert.ok(
          (risk.phases[phase.id] ?? []).length >= MIN_ACTIONS,
          `${risk.slug} tiene menos de ${MIN_ACTIONS} acciones en ${phase.id}`,
        )
      }
    }
  })

  it('kit item ids are unique', () => {
    assertUnique(kitItemIds)
    assert.equal(kitItemIds.length, emergencyKit.flatMap((category) => category.items).length)
  })

  it('family plan ids are unique', () => {
    assertUnique(planStepIds)
    assert.equal(planStepIds.length, familyPlanSteps.length)
  })
})
