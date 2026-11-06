import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { directionsUrl, placeUrl, project } from './map.ts'

describe('project', () => {
  it('returns nothing for no points', () => {
    assert.deepEqual(project([]), [])
  })

  it('puts a single point in the center', () => {
    assert.deepEqual(project([{ lat: 4.6, lng: -74.08 }]), [{ x: 50, y: 50 }])
  })

  it('puts identical points in the center', () => {
    const same = { lat: 4.6, lng: -74.08 }
    assert.deepEqual(project([same, same]), [
      { x: 50, y: 50 },
      { x: 50, y: 50 },
    ])
  })

  it('handles points on the same latitude without dividing by zero', () => {
    const out = project([
      { lat: 4.6, lng: -74.1 },
      { lat: 4.6, lng: -74.0 },
    ])
    assert.deepEqual(out, [
      { x: 10, y: 50 },
      { x: 90, y: 50 },
    ])
  })

  it('handles points on the same longitude without dividing by zero', () => {
    const out = project([
      { lat: 4.7, lng: -74.08 },
      { lat: 4.6, lng: -74.08 },
    ])
    assert.deepEqual(out, [
      { x: 50, y: 10 },
      { x: 50, y: 90 },
    ])
  })

  it('keeps north up, east right, one scale, centered in the box', () => {
    const out = project([
      { lat: 4.6, lng: -74.1 },
      { lat: 4.7, lng: -74.0 },
      { lat: 4.65, lng: -74.05 },
    ])
    assert.ok(out[1].x > out[0].x)
    assert.ok(out[1].y < out[0].y)
    assert.deepEqual(out[2], { x: 50, y: 50 })
    for (const { x, y } of out) {
      assert.ok(x >= 10 && x <= 90 && y >= 10 && y <= 90)
    }
    const width = out[1].x - out[0].x
    const height = out[0].y - out[1].y
    assert.ok(width < height, 'longitude is shortened by cos(latitude), so the wider degree span draws narrower')
    assert.equal(Math.max(width, height), 80)
  })

  it('keeps the input order', () => {
    const input = [
      { lat: 4.65, lng: -74.05 },
      { lat: 4.6, lng: -74.1 },
      { lat: 4.7, lng: -74.0 },
    ]
    const out = project(input)
    assert.equal(out.length, 3)
    assert.deepEqual(project([...input].reverse()).reverse(), out)
  })
})

describe('links', () => {
  it('builds the Google Maps directions and place urls', () => {
    const target = { lat: 4.608, lng: -74.0808 }
    assert.equal(directionsUrl(target), 'https://www.google.com/maps/dir/?api=1&destination=4.608,-74.0808')
    assert.equal(placeUrl(target), 'https://www.google.com/maps?q=4.608,-74.0808')
  })
})
