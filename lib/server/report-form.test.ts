import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { MAX_PHOTO_BYTES, parseReportForm } from './report-form.ts'

const report = {
  id: '3f2b8c1e-5a4d-4e6f-9b0a-1c2d3e4f5a6b',
  createdAt: '2026-11-05T12:00:00.000Z',
  type: 'deslizamiento',
  location: { mode: 'manual', address: 'Calle 5 # 3-20' },
  description: 'Cayó tierra sobre el camino',
  severity: 'media',
  peopleAffected: 'no',
  contact: { anonymous: true },
  consent: true,
}

const jpegBytes = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00])

function formWith(parts: { datos?: string; foto?: Blob }) {
  const form = new FormData()
  if (parts.datos !== undefined) form.append('datos', parts.datos)
  if (parts.foto) form.append('foto', parts.foto, 'foto.jpg')
  return form
}

const datos = JSON.stringify(report)

describe('parseReportForm', () => {
  it('accepts a report without photo', async () => {
    const result = await parseReportForm(formWith({ datos }))
    assert.equal(result.ok, true)
    assert.equal(result.ok && result.photo, undefined)
  })

  it('accepts a report with a tiny JPEG', async () => {
    const result = await parseReportForm(formWith({ datos, foto: new Blob([jpegBytes], { type: 'image/jpeg' }) }))
    assert.equal(result.ok, true)
    assert.equal(result.ok && result.photo?.size, jpegBytes.length)
  })

  it('rejects a PNG type', async () => {
    const result = await parseReportForm(formWith({ datos, foto: new Blob([jpegBytes], { type: 'image/png' }) }))
    assert.deepEqual(result, { ok: false, status: 400 })
  })

  it('rejects an oversize photo with 413', async () => {
    const big = new Uint8Array(MAX_PHOTO_BYTES + 1)
    big.set(jpegBytes)
    const result = await parseReportForm(formWith({ datos, foto: new Blob([big], { type: 'image/jpeg' }) }))
    assert.deepEqual(result, { ok: false, status: 413 })
  })

  it('rejects a missing datos field', async () => {
    assert.deepEqual(await parseReportForm(formWith({})), { ok: false, status: 400 })
  })

  it('rejects datos that is not valid JSON', async () => {
    assert.deepEqual(await parseReportForm(formWith({ datos: '{nope' })), { ok: false, status: 400 })
  })

  it('rejects a JPEG type with other bytes', async () => {
    const text = new Blob(['not an image'], { type: 'image/jpeg' })
    assert.deepEqual(await parseReportForm(formWith({ datos, foto: text })), { ok: false, status: 400 })
  })
})
