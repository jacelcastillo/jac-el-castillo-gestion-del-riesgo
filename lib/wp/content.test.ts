import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { sortNotices, toContent } from './content.ts'

const NOW = new Date('2026-11-04T12:00:00-05:00')
const link = 'https://jacelcastillo.com.co/simulacro/'

function aviso(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    titulo: 'Aviso',
    resumen: 'Resumen',
    link,
    publicada: '2026-11-01T10:00:00-05:00',
    evento: { tipo: 'comunicado', fecha: '', lugar: '' },
    ...overrides,
  }
}

function contacto(overrides: Record<string, unknown> = {}) {
  return { id: 10, nombre: 'Ana', grupo: 'junta', cargo: 'Presidenta', sector: '', telefono: '300 555 0101', ...overrides }
}

const noticesOf = (avisos: unknown[]) => toContent({ avisos }, NOW).notices

describe('alert', () => {
  it('is null when nivel is unknown or missing', () => {
    assert.equal(toContent({ alerta: { nivel: 'azul', titulo: 'x' } }, NOW).alert, null)
    assert.equal(toContent({ alerta: { titulo: 'x' } }, NOW).alert, null)
    assert.equal(toContent({ alerta: null }, NOW).alert, null)
  })

  it('maps a valid alert and makes source optional', () => {
    const { alert } = toContent(
      { alerta: { nivel: 'roja', titulo: 'T', descripcion: 'D', fuente: '', actualizada: '2026-11-04T10:32:00-05:00' } },
      NOW,
    )
    assert.deepEqual(alert, {
      level: 'roja',
      title: 'T',
      description: 'D',
      updatedAt: '2026-11-04T10:32:00-05:00',
      source: undefined,
    })
  })
})

describe('notices', () => {
  it('ignores an invalid fecha and keeps the publish date', () => {
    const [notice] = noticesOf([aviso({ evento: { tipo: 'simulacro', fecha: 'mañana', lugar: '' } })])
    assert.equal(notice.date, '2026-11-01')
    assert.equal(notice.time, undefined)
    assert.equal(notice.kind, 'simulacro')
  })

  it('uses the event date and time for valid events', () => {
    const [notice] = noticesOf([aviso({ evento: { tipo: 'simulacro', fecha: '2026-11-19T09:00', lugar: 'Salón comunal' } })])
    assert.equal(notice.date, '2026-11-19')
    assert.equal(notice.time, '9:00 a. m.')
    assert.equal(notice.place, 'Salón comunal')
  })

  it('sorts upcoming events first, then the rest by publish date', () => {
    const notices = noticesOf([
      aviso({ id: 1, titulo: 'old', publicada: '2026-10-01T10:00:00-05:00' }),
      aviso({ id: 2, titulo: 'past event', publicada: '2026-09-01T10:00:00-05:00', evento: { tipo: 'taller', fecha: '2026-10-30T09:00', lugar: '' } }),
      aviso({ id: 3, titulo: 'later event', evento: { tipo: 'simulacro', fecha: '2026-12-01T09:00', lugar: '' } }),
      aviso({ id: 4, titulo: 'soon event', evento: { tipo: 'simulacro', fecha: '2026-11-19T09:00', lugar: '' } }),
      aviso({ id: 5, titulo: 'new', publicada: '2026-11-03T10:00:00-05:00' }),
    ])
    assert.deepEqual(notices.map((n) => n.title), ['soon event', 'later event', 'new', 'old', 'past event'])
  })

  it('sortNotices orders by event ascending then publish descending', () => {
    const items = [
      { eventAt: null, publishedAt: 1 },
      { eventAt: NOW.getTime() + 2, publishedAt: 0 },
      { eventAt: NOW.getTime() + 1, publishedAt: 0 },
      { eventAt: null, publishedAt: 5 },
    ]
    assert.deepEqual(sortNotices(items, NOW).map((i) => [i.eventAt === null ? null : i.eventAt - NOW.getTime(), i.publishedAt]), [
      [1, 0],
      [2, 0],
      [null, 5],
      [null, 1],
    ])
  })

  it('drops a notice with an invalid link and builds href from the pathname', () => {
    const notices = noticesOf([aviso({ id: 1, link: 'not a url' }), aviso({ id: 2, link: 'javascript:alert(1)' }), aviso({ id: 3 })])
    assert.equal(notices.length, 1)
    assert.equal(notices[0].href, 'https://jacelcastillo.com.co/simulacro/')
  })

  it('keeps markup as plain text', () => {
    const [notice] = noticesOf([aviso({ titulo: '<script>alert(1)</script>' })])
    assert.equal(notice.title, '<script>alert(1)</script>')
  })
})

describe('contacts', () => {
  it('maps the phone to tel digits and keeps the display text', () => {
    const [contact] = toContent({ contactos: [contacto()] }, NOW).contacts
    assert.equal(contact.phone, '+573005550101')
    assert.equal(contact.displayPhone, '300 555 0101')
    assert.equal(contact.group, 'jac')
  })

  it('maps lider to sector with cargo and sector in the role', () => {
    const [contact] = toContent({ contactos: [contacto({ grupo: 'lider', cargo: 'Líder', sector: 'Norte' })] }, NOW).contacts
    assert.equal(contact.group, 'sector')
    assert.equal(contact.role, 'Líder · Norte')
  })

  it('drops contacts without a usable phone', () => {
    const { contacts } = toContent({ contactos: [contacto({ telefono: '' }), contacto({ id: 11, telefono: '12 34' })] }, NOW)
    assert.deepEqual(contacts, [])
  })

  it('sends comite to committee without needing a phone', () => {
    const content = toContent({ contactos: [contacto({ grupo: 'comite', telefono: '', cargo: 'Secretaria' })] }, NOW)
    assert.deepEqual(content.contacts, [])
    assert.deepEqual(content.committee, [{ id: '10', name: 'Ana', role: 'Secretaria' }])
  })
})

describe('malformed input', () => {
  it('returns empty content', () => {
    for (const input of ['text', [], null, 42, {}, { avisos: 'x', contactos: {}, alerta: 'x' }]) {
      assert.deepEqual(toContent(input, NOW), { alert: null, notices: [], contacts: [], committee: [] })
    }
  })
})
