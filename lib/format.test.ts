import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { formatFileSize } from './format.ts'

describe('formatFileSize', () => {
  it('uses KB below 1 MB', () => {
    assert.equal(formatFileSize(245760), '240 KB')
    assert.equal(formatFileSize(1), '1 KB')
    assert.equal(formatFileSize(1048575), '1,0 MB')
  })

  it('uses MB with one decimal from 1 MB', () => {
    assert.equal(formatFileSize(1048576), '1,0 MB')
    assert.equal(formatFileSize(1572864), '1,5 MB')
    assert.equal(formatFileSize(12 * 1048576), '12,0 MB')
  })
})
