import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { parseIdList } from './parse-id-list.ts'

describe('parseIdList', () => {
  it('returns [] for null', () => {
    assert.deepEqual(parseIdList(null), [])
  })

  it('returns [] for corrupt JSON', () => {
    assert.deepEqual(parseIdList('{not json'), [])
  })

  it('returns [] when the value is not an array', () => {
    assert.deepEqual(parseIdList('{"a":1}'), [])
    assert.deepEqual(parseIdList('"agua"'), [])
  })

  it('keeps only string items', () => {
    assert.deepEqual(parseIdList('["agua",1,null,"radio",{"x":1}]'), ['agua', 'radio'])
  })

  it('returns a valid list as is', () => {
    assert.deepEqual(parseIdList('["agua","radio"]'), ['agua', 'radio'])
  })
})
