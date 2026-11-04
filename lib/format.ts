import { siteConfig } from '@/config/site'

const dateFormatter = new Intl.DateTimeFormat(siteConfig.locale, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
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
export function formatDate(isoDate: string): string {
  const date = isoDate.length === 10 ? new Date(`${isoDate}T12:00:00-05:00`) : new Date(isoDate)
  return dateFormatter.format(date)
}

export function formatDateTime(isoDate: string): string {
  return dateTimeFormatter.format(new Date(isoDate))
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, '')}`
}
