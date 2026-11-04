import type { NavItem, PageCopy, QuickLink } from '@/types/content'

export const siteConfig = {
  name: 'Gestión del Riesgo – JAC El Castillo',
  shortName: 'Riesgo El Castillo',
  organization: 'Junta de Acción Comunal El Castillo',
  description:
    'Aprende a prevenir, reaccionar y recuperarte ante emergencias en El Castillo. Reporta incidentes, conoce los riesgos del sector y ten a mano los números de emergencia.',
  url: 'https://gestionriesgo.jacelcastillo.com',
  locale: 'es-CO',
  timeZone: 'America/Bogota',
  themeColor: '#1e4fa3',
} as const

/** Barra inferior fija en móvil. */
export const bottomNavigation: NavItem[] = [
  { href: '/', label: 'Inicio', icon: 'home' },
  { href: '/riesgos', label: 'Aprende', icon: 'book' },
  { href: '/reportar', label: 'Reportar', icon: 'siren', highlight: true },
  { href: '/contactos', label: 'Contactos', icon: 'phone' },
]

/** Navegación completa (encabezado y menú). */
export const mainNavigation: NavItem[] = [
  { href: '/', label: 'Inicio', icon: 'home' },
  { href: '/riesgos', label: 'Conoce tus riesgos', icon: 'book' },
  { href: '/mapa', label: 'Mapa comunitario', icon: 'map' },
  { href: '/preparate', label: 'Prepárate', icon: 'backpack' },
  { href: '/contactos', label: 'Emergencias', icon: 'phone' },
  { href: '/avisos', label: 'Avisos', icon: 'megaphone' },
  { href: '/sobre-la-jac', label: 'Sobre la JAC', icon: 'users' },
  { href: '/mis-reportes', label: 'Mis reportes', icon: 'clipboard' },
]

export const quickLinks: QuickLink[] = [
  {
    href: '/riesgos',
    title: 'Conoce tus riesgos',
    description: 'Qué hacer antes, durante y después.',
    icon: 'book',
  },
  {
    href: '/mapa',
    title: 'Mapa comunitario',
    description: 'Puntos de encuentro y rutas.',
    icon: 'map',
  },
  {
    href: '/preparate',
    title: 'Prepárate',
    description: 'Plan familiar y kit de emergencia.',
    icon: 'backpack',
  },
  {
    href: '/contactos',
    title: 'Números de emergencia',
    description: 'Llama con un solo toque.',
    icon: 'phone',
  },
  {
    href: '/avisos',
    title: 'Avisos y talleres',
    description: 'Simulacros y comunicados.',
    icon: 'megaphone',
  },
  {
    href: '/mis-reportes',
    title: 'Mis reportes',
    description: 'Revisa el estado de tus reportes.',
    icon: 'clipboard',
  },
]

export const pageCopy = {
  home: {
    title: 'Juntos cuidamos El Castillo',
    intro:
      'Aquí encuentras lo necesario para prevenir, actuar a tiempo y recuperarnos como comunidad.',
  },
  risks: {
    title: 'Conoce tus riesgos',
    intro:
      'Estas son las amenazas más comunes en nuestro sector. Toca cada una para saber qué hacer antes, durante y después.',
  },
  map: {
    title: 'Mapa comunitario',
    intro:
      'Ubica los puntos de encuentro, las rutas de evacuación y las zonas donde hay que tener más cuidado.',
  },
  prepare: {
    title: 'Prepárate',
    intro:
      'Una familia preparada reacciona mejor. Haz tu plan paso a paso y arma tu kit de emergencia.',
  },
  contacts: {
    title: 'Directorio de emergencias',
    intro: 'Toca un número para llamar de inmediato. No necesitas internet para hacer la llamada.',
  },
  notices: {
    title: 'Avisos y capacitaciones',
    intro: 'Comunicados de la JAC, simulacros y talleres para toda la comunidad.',
  },
  about: {
    title: 'Sobre la JAC',
    intro:
      'La Junta de Acción Comunal El Castillo trabaja con los vecinos para que el barrio sea un lugar más seguro.',
  },
  report: {
    title: 'Reportar incidente',
    intro: 'Cuéntanos qué está pasando. Tu reporte llega al comité de gestión del riesgo de la JAC.',
  },
  myReports: {
    title: 'Mis reportes',
    intro: 'Los reportes que has hecho desde este celular y en qué van.',
  },
} satisfies Record<string, PageCopy>
