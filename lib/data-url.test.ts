import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { dataUrlToBlob } from './data-url.ts'

describe('dataUrlToBlob', () => {
  it('keeps the bytes and the MIME type', async () => {
    const original = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46])
    const dataUrl = `data:image/jpeg;base64,${Buffer.from(original).toString('base64')}`
    const blob = dataUrlToBlob(dataUrl)
    assert.equal(blob.type, 'image/jpeg')
    assert.deepEqual(new Uint8Array(await blob.arrayBuffer()), original)
  })
})
