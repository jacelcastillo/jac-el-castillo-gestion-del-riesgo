import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { incidentSchema, reportRequestSchema } from './incident-schema.ts'

const valid = {
  type: 'deslizamiento',
  location: { mode: 'manual', address: 'Calle 5 # 3-20, El Castillo' },
  description: 'Cayó tierra sobre el camino principal.',
  severity: 'media',
  peopleAffected: 'no',
  contact: { anonymous: true },
  consent: true,
}

const issuePaths = (input: unknown) => {
  const result = incidentSchema.safeParse(input)
  return result.success ? [] : result.error.issues.map((issue) => issue.path.join('.'))
}

describe('incidentSchema', () => {
  it('accepts a valid anonymous report', () => {
    assert.equal(incidentSchema.safeParse(valid).success, true)
  })

  it('rejects a report without location', () => {
    assert.ok(issuePaths({ ...valid, location: { mode: 'manual', address: '' } }).includes('location.address'))
  })

  it('rejects a description over 600 characters', () => {
    assert.ok(issuePaths({ ...valid, description: 'a'.repeat(601) }).includes('description'))
  })

  it('rejects an invalid phone when not anonymous', () => {
    const contact = { anonymous: false, name: 'Ana Pérez', phone: '12345' }
    assert.ok(issuePaths({ ...valid, contact }).includes('contact.phone'))
  })

  it('rejects missing or false consent', () => {
    assert.ok(issuePaths({ ...valid, consent: undefined }).includes('consent'))
    assert.ok(issuePaths({ ...valid, consent: false }).includes('consent'))
  })
})

describe('reportRequestSchema', () => {
  const request = { ...valid, id: crypto.randomUUID(), createdAt: new Date().toISOString() }

  it('requires a uuid id and an ISO date', () => {
    assert.equal(reportRequestSchema.safeParse(request).success, true)
    assert.equal(reportRequestSchema.safeParse({ ...request, id: 'x' }).success, false)
    assert.equal(reportRequestSchema.safeParse({ ...request, createdAt: 'ayer' }).success, false)
  })

  it('strips the photo', () => {
    const photo = { dataUrl: 'data:image/jpeg;base64,AAAA', width: 1, height: 1, sizeKb: 1 }
    const parsed = reportRequestSchema.parse({ ...request, photo })
    assert.equal('photo' in parsed, false)
  })
})
