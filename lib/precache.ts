import { risks } from '../config/risks.ts'
import { bottomNavigation, mainNavigation } from '../config/site.ts'

const EXTRA_PAGES = ['/riesgos', '/mapa', '/recursos', '/preparate', '/avisos', '/sobre-la-jac', '/mis-reportes', '/privacidad', '/offline']

export function precachePaths(): string[] {
  const paths = [
    ...mainNavigation.map((item) => item.href),
    ...bottomNavigation.map((item) => item.href),
    ...risks.map((risk) => `/riesgos/${risk.slug}`),
    ...EXTRA_PAGES,
  ]
  return [...new Set(paths)]
}
