import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { risks } from '../config/risks.ts'
import { precachePaths } from './precache.ts'

describe('precachePaths', () => {
  const paths = precachePaths()

  it('includes the offline page and every risk', () => {
    assert.ok(paths.includes('/offline'))
    for (const risk of risks) assert.ok(paths.includes(`/riesgos/${risk.slug}`))
  })

  it('includes the community map', () => {
    assert.ok(paths.includes('/mapa'))
  })

  it('includes the resources page', () => {
    assert.ok(paths.includes('/recursos'))
  })

  it('has no duplicates', () => {
    assert.equal(new Set(paths).size, paths.length)
  })
})
