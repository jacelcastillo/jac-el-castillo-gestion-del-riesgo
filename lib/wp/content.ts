import { wpContactIcons } from '../../config/contacts.ts'
import { siteConfig } from '../../config/site.ts'
import type {
  AlertLevelId,
  AlertStatus,
  CommitteeMember,
  Contact,
  Notice,
  NoticeKind,
} from '../../types/content.ts'

export interface Content {
  alert: AlertStatus | null
  notices: Notice[]
  contacts: Contact[]
  committee: CommitteeMember[]
}

export interface Sortable {
  eventAt: number | null
  publishedAt: number
}

const ALERT_LEVELS: readonly string[] = ['verde', 'amarilla', 'naranja', 'roja']
const NOTICE_KINDS: readonly string[] = ['comunicado', 'simulacro', 'taller']
const MIN_PHONE_DIGITS = 7

const dayFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: siteConfig.timeZone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const timeFormatter = new Intl.DateTimeFormat(siteConfig.locale, {
  timeZone: siteConfig.timeZone,
  hour: 'numeric',
  minute: '2-digit',
})

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function toId(value: unknown): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  const id = text(value)
  return id === '' ? null : id
}

function list(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter(isRecord) : []
}

function parseTimestamp(value: unknown): number | null {
  const raw = text(value)
  if (raw === '') return null
  const time = new Date(raw).getTime()
  return Number.isNaN(time) ? null : time
}

/** Bogotá local time without offset, "YYYY-MM-DDTHH:mm". */
function parseEventTimestamp(value: unknown): number | null {
  const raw = text(value)
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(raw)) return null
  const time = new Date(`${raw}:00-05:00`).getTime()
  if (Number.isNaN(time)) return null
  return dayFormatter.format(time) === raw.slice(0, 10) ? time : null
}

export function sortNotices<T extends Sortable>(items: T[], now: Date = new Date()): T[] {
  const nowMs = now.getTime()
  const upcoming = (item: T) => item.eventAt !== null && item.eventAt >= nowMs
  return [...items].sort((a, b) => {
    const aUp = upcoming(a)
    const bUp = upcoming(b)
    if (aUp && bUp) return (a.eventAt as number) - (b.eventAt as number)
    if (aUp !== bUp) return aUp ? -1 : 1
    return b.publishedAt - a.publishedAt
  })
}

function toAlert(value: unknown): AlertStatus | null {
  if (!isRecord(value)) return null
  const level = text(value.nivel)
  if (!ALERT_LEVELS.includes(level)) return null
  const updatedAt = parseTimestamp(value.actualizada) === null ? undefined : text(value.actualizada)
  return {
    level: level as AlertLevelId,
    title: text(value.titulo),
    description: text(value.descripcion),
    updatedAt,
    source: text(value.fuente) || undefined,
  }
}

function toHref(link: unknown): string | null {
  try {
    const url = new URL(text(link))
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
    return siteConfig.mainSiteUrl + url.pathname
  } catch {
    return null
  }
}

interface NoticeEntry extends Sortable {
  notice: Notice
}

function toNotice(raw: Record<string, unknown>): NoticeEntry | null {
  const id = toId(raw.id)
  const title = text(raw.titulo)
  const href = toHref(raw.link)
  const publishedAt = parseTimestamp(raw.publicada)
  if (id === null || title === '' || href === null) return null

  const evento = isRecord(raw.evento) ? raw.evento : {}
  const eventAt = parseEventTimestamp(evento.fecha)
  const dateMs = eventAt ?? publishedAt
  if (dateMs === null) return null

  const kind = text(evento.tipo)
  const place = text(evento.lugar)
  return {
    notice: {
      id,
      kind: (NOTICE_KINDS.includes(kind) ? kind : 'comunicado') as NoticeKind,
      title,
      summary: text(raw.resumen),
      date: dayFormatter.format(dateMs),
      time: eventAt === null ? undefined : timeFormatter.format(eventAt).replace(/\s/g, ' '),
      place: place === '' ? undefined : place,
      href,
    },
    eventAt,
    publishedAt: publishedAt ?? dateMs,
  }
}

function toPhone(display: string): string | null {
  const digits = display.replace(/\D/g, '')
  if (digits.length < MIN_PHONE_DIGITS) return null
  if (digits.length === 10 && digits.startsWith('3')) return `+57${digits}`
  return display.startsWith('+') ? `+${digits}` : digits
}

export function toContent(json: unknown, now: Date = new Date()): Content {
  const root = isRecord(json) ? json : {}
  const contacts: Contact[] = []
  const committee: CommitteeMember[] = []

  for (const raw of list(root.contactos)) {
    const id = toId(raw.id)
    const name = text(raw.nombre)
    const group = text(raw.grupo)
    if (id === null || name === '') continue
    const cargo = text(raw.cargo)

    if (group === 'comite') {
      committee.push({ id, name, role: cargo })
      continue
    }
    if (group !== 'junta' && group !== 'lider') continue

    const displayPhone = text(raw.telefono)
    const phone = toPhone(displayPhone)
    if (phone === null) continue
    const sector = text(raw.sector)
    const mapped = group === 'junta' ? 'jac' : 'sector'
    contacts.push({
      id: `wp-${id}`,
      name,
      role: [cargo, sector].filter(Boolean).join(' · '),
      phone,
      displayPhone,
      group: mapped,
      icon: wpContactIcons[mapped],
    })
  }

  const notices = sortNotices(
    list(root.avisos).flatMap((raw) => toNotice(raw) ?? []),
    now,
  ).map((entry) => entry.notice)

  return { alert: toAlert(root.alerta), notices, contacts, committee }
}
