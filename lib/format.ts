import { siteConfig } from '../config/site.ts'

const dateFormatter = new Intl.DateTimeFormat(siteConfig.locale, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: siteConfig.timeZone,
})

const shortDateFormatter = new Intl.DateTimeFormat(siteConfig.locale, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: siteConfig.timeZone,
})

const dateTimeFormatter = new Intl.DateTimeFormat(siteConfig.locale, {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: siteConfig.timeZone,
})

/** Fechas "YYYY-MM-DD" se interpretan a mediodía para evitar saltos de día por zona horaria. */
const toDate = (isoDate: string) => (isoDate.length === 10 ? new Date(`${isoDate}T12:00:00-05:00`) : new Date(isoDate))

export function formatDate(isoDate: string): string {
  return dateFormatter.format(toDate(isoDate))
}

/** "5 jul 2026": es-CO intercala "de" entre las partes, por eso se arma a mano. */
export function formatShortDate(isoDate: string): string {
  const parts = Object.fromEntries(shortDateFormatter.formatToParts(toDate(isoDate)).map((p) => [p.type, p.value]))
  return `${parts.day} ${parts.month} ${parts.year}`
}

export function formatDateTime(isoDate: string): string {
  return dateTimeFormatter.format(new Date(isoDate))
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, '')}`
}

const megabyteFormatter = new Intl.NumberFormat(siteConfig.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })

/** "240 KB" por debajo de 1 MB, "1,5 MB" desde ahí. */
export function formatFileSize(bytes: number): string {
  const kilobytes = Math.max(1, Math.round(bytes / 1024))
  if (kilobytes < 1024) return `${kilobytes} KB`
  return `${megabyteFormatter.format(bytes / 1024 / 1024)} MB`
}
