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

  it('upcoming keeps only future events in order', () => {
    const { upcoming } = toContent(
      {
        avisos: [
          aviso({ id: 1, titulo: 'no date' }),
          aviso({ id: 2, titulo: 'past', evento: { tipo: 'taller', fecha: '2026-10-30T09:00', lugar: '' } }),
          aviso({ id: 3, titulo: 'later', evento: { tipo: 'simulacro', fecha: '2026-12-01T09:00', lugar: '' } }),
          aviso({ id: 4, titulo: 'soon', evento: { tipo: 'simulacro', fecha: '2026-11-19T09:00', lugar: '' } }),
        ],
      },
      NOW,
    )
    assert.deepEqual(upcoming.map((n) => n.title), ['soon', 'later'])
  })

  it('published is true only without an event date', () => {
    const [plain, event] = noticesOf([
      aviso({ id: 1 }),
      aviso({ id: 2, evento: { tipo: 'simulacro', fecha: '2026-11-19T09:00', lugar: '' } }),
    ]).sort((a, b) => Number(b.published) - Number(a.published))
    assert.equal(plain.published, true)
    assert.equal(event.published, false)
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
    assert.equal(notices[0].href, 'https://web.jacelcastillo.com.co/simulacro/')
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
      assert.deepEqual(toContent(input, NOW), { alert: null, notices: [], upcoming: [], contacts: [], committee: [], points: [], resources: [] })
    }
  })
})

function punto(overrides: Record<string, unknown> = {}) {
  return {
    id: 20,
    tipo: 'encuentro',
    nombre: 'Cancha',
    descripcion: 'D',
    referencia: 'R',
    coordenadas: [[4.608, -74.0808]],
    ...overrides,
  }
}

const pointsOf = (puntos: unknown[]) => toContent({ puntos }, NOW).points

describe('map points', () => {
  it('is empty when puntos is missing or not a list', () => {
    assert.deepEqual(toContent({}, NOW).points, [])
    assert.deepEqual(toContent({ puntos: 'x' }, NOW).points, [])
  })

  it('maps a meeting point to the center with its real target', () => {
    const [point] = pointsOf([punto()])
    assert.equal(point.id, 'wp-20')
    assert.equal(point.kind, 'encuentro')
    assert.deepEqual(point.position, { x: 50, y: 50 })
    assert.deepEqual(point.target, { lat: 4.608, lng: -74.0808 })
    assert.equal(point.path, undefined)
  })

  it('draws a route with all its vertices and targets the first one', () => {
    const [route] = pointsOf([
      punto({ tipo: 'ruta', coordenadas: [[4.59, -74.09], [4.6, -74.085], [4.61, -74.08]] }),
    ])
    assert.equal(route.path?.length, 3)
    assert.deepEqual(route.position, route.path?.[0])
    assert.deepEqual(route.target, { lat: 4.59, lng: -74.09 })
  })

  it('drops invalid vertices, and points left without any', () => {
    const points = pointsOf([
      punto({ id: 1, coordenadas: [[4.6, -74.08], ['x', 1], [91, 0], [0, 181], [1], null, [Number.NaN, 1]] }),
      punto({ id: 2, coordenadas: [] }),
      punto({ id: 3, coordenadas: 'nada' }),
      punto({ id: 4, coordenadas: [[200, 0]] }),
    ])
    assert.deepEqual(points.map((p) => p.id), ['wp-1'])
  })

  it('drops points with an unknown kind, no name or no id', () => {
    const points = pointsOf([punto({ tipo: 'otro' }), punto({ nombre: ' ' }), punto({ id: null }), punto({ id: 9 })])
    assert.deepEqual(points.map((p) => p.id), ['wp-9'])
  })

  it('keeps one projection for all points and the input order', () => {
    const points = pointsOf([
      punto({ id: 1, coordenadas: [[4.6, -74.1]] }),
      punto({ id: 2, tipo: 'riesgo', coordenadas: [[4.7, -74.0]] }),
    ])
    assert.deepEqual(points.map((p) => p.id), ['wp-1', 'wp-2'])
    assert.ok(points[1].position.x > points[0].position.x)
    assert.ok(points[1].position.y < points[0].position.y)
  })
})

describe('resources', () => {
  const pdf = (overrides: Record<string, unknown> = {}) => ({
    id: 7,
    titulo: 'Guía',
    descripcion: 'Qué hacer',
    url: 'https://jacelcastillo.com.co/wp-content/uploads/2026/11/guia.pdf',
    tamano: 245760,
    formato: 'pdf',
    ...overrides,
  })
  const resourcesOf = (recursos: unknown[]) => toContent({ recursos }, NOW).resources

  it('is empty when recursos is missing', () => {
    assert.deepEqual(toContent({}, NOW).resources, [])
  })

  it('maps a valid resource', () => {
    assert.deepEqual(resourcesOf([pdf()]), [
      {
        id: 'wp-7',
        title: 'Guía',
        description: 'Qué hacer',
        href: 'https://jacelcastillo.com.co/wp-content/uploads/2026/11/guia.pdf',
        sizeBytes: 245760,
        format: 'pdf',
      },
    ])
  })

  it('keeps the WordPress order', () => {
    assert.deepEqual(resourcesOf([pdf({ id: 2, titulo: 'B' }), pdf({ id: 1, titulo: 'A' })]).map((r) => r.title), ['B', 'A'])
  })

  it('accepts every format with a matching extension', () => {
    const cases = [
      ['word', 'a.docx'],
      ['word', 'a.DOC'],
      ['excel', 'a.xlsx'],
      ['powerpoint', 'a.pptx'],
      ['imagen', 'a.webp'],
      ['imagen', 'a.jpg'],
    ]
    for (const [formato, file] of cases) {
      const url = `https://jacelcastillo.com.co/wp-content/uploads/${file}`
      assert.equal(resourcesOf([pdf({ formato, url })]).length, 1, `${formato} ${file}`)
    }
  })

  it('drops resources without a title or with an unknown format', () => {
    assert.equal(resourcesOf([pdf({ titulo: '  ' }), pdf({ formato: 'txt' }), pdf({ formato: undefined }), pdf({ id: null })]).length, 0)
  })

  it('drops invalid links', () => {
    const bad = [
      'javascript:alert(1)',
      'ftp://jacelcastillo.com.co/wp-content/uploads/guia.pdf',
      'https://jacelcastillo.com.co/otra-ruta/guia.pdf',
      'https://jacelcastillo.com.co/wp-content/uploads/guia.exe',
      'https://jacelcastillo.com.co/wp-content/uploads/guia.docx',
      'no es un enlace',
      '',
    ]
    for (const url of bad) assert.equal(resourcesOf([pdf({ url })]).length, 0, url)
  })

  it('drops invalid sizes', () => {
    for (const tamano of [0, -5, 1.5, '240', null, undefined]) assert.equal(resourcesOf([pdf({ tamano })]).length, 0, String(tamano))
  })
})
