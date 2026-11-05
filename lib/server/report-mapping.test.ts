import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { classifyWpStatus, clientIp, isJsonContentType, mapWpStatus, mapWpStatuses } from './report-mapping.ts'

describe('report mapping', () => {
  it('maps WordPress states to app statuses', () => {
    assert.equal(mapWpStatus('recibido'), 'enviado')
    assert.equal(mapWpStatus('en_atencion'), 'en_atencion')
    assert.equal(mapWpStatus('cerrado'), 'cerrado')
    assert.equal(mapWpStatus('otro'), undefined)
    assert.equal(mapWpStatus(undefined), undefined)
  })

  it('takes the first forwarded IP, then x-real-ip', () => {
    assert.equal(clientIp(new Headers({ 'x-forwarded-for': '1.2.3.4, 10.0.0.1' })), '1.2.3.4')
    assert.equal(clientIp(new Headers({ 'x-real-ip': '5.6.7.8' })), '5.6.7.8')
    assert.equal(clientIp(new Headers()), undefined)
  })

  it('detects JSON content types, not the anti-bot page', () => {
    assert.equal(isJsonContentType('application/json; charset=UTF-8'), true)
    assert.equal(isJsonContentType('text/html; charset=UTF-8'), false)
    assert.equal(isJsonContentType(null), false)
  })

  it('classifies WordPress statuses', () => {
    assert.equal(classifyWpStatus(400), 'bad-request')
    assert.equal(classifyWpStatus(429), 'rate-limited')
    assert.equal(classifyWpStatus(401), 'misconfigured')
    assert.equal(classifyWpStatus(403), 'misconfigured')
    assert.equal(classifyWpStatus(503), 'retry')
  })

  it('maps a WordPress status list and skips unknown rows', () => {
    assert.deepEqual(
      mapWpStatuses([
        { id: 'a', estado: 'recibido', actualizado: 'x' },
        { id: 'b', estado: 'en_atencion' },
        { id: 'c', estado: 'raro' },
        { estado: 'cerrado' },
        null,
      ]),
      { a: 'enviado', b: 'en_atencion' },
    )
  })

  it('rejects a status body that is not a list', () => {
    assert.equal(mapWpStatuses({ id: 'a' }), undefined)
    assert.equal(mapWpStatuses(null), undefined)
  })
})
