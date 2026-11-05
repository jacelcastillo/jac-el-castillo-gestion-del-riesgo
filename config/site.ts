import type { NavItem, PageCopy } from '@/types/content'

export const siteConfig = {
  name: 'Gestión del Riesgo · JAC El Castillo',
  shortName: 'Gestión del Riesgo',
  organization: 'JAC El Castillo',
  description:
    'Aprende a prevenir, reaccionar y recuperarte ante emergencias en El Castillo. Reporta incidentes, conoce los riesgos del sector y ten a mano los números de emergencia.',
  url: 'https://gestiondelriesgo.jacelcastillo.com.co',
  mainSiteUrl: 'https://web.jacelcastillo.com.co',
  locale: 'es-CO',
  timeZone: 'America/Bogota',
  themeColor: '#1f3d9e',
} as const

/** Barra inferior fija en móvil. */
const learnMatch = ['/riesgos', '/preparate']

export const bottomNavigation: NavItem[] = [
  { href: '/', label: 'Inicio', icon: 'home' },
  { href: '/aprende', label: 'Aprende', icon: 'book', match: learnMatch },
  { href: '/reportar', label: 'Reportar', icon: 'siren', highlight: true },
  { href: '/contactos', label: 'Contactos', icon: 'phone' },
]

/** Navegación del encabezado en computador. */
export const mainNavigation: NavItem[] = [
  { href: '/', label: 'Inicio', icon: 'home' },
  { href: '/aprende', label: 'Aprende', icon: 'book', match: learnMatch },
  { href: '/avisos', label: 'Avisos', icon: 'megaphone' },
  { href: '/contactos', label: 'Contactos', icon: 'phone' },
  { href: '/reportar', label: 'Reportar', icon: 'siren', highlight: true },
]

export const pageCopy = {
  home: {
    title: 'Juntos cuidamos El Castillo',
    intro:
      'Aquí encuentras lo necesario para prevenir, actuar a tiempo y recuperarnos como comunidad.',
  },
  learn: {
    title: 'Aprende',
    intro: 'Conoce los riesgos de El Castillo y prepara a tu familia para actuar a tiempo.',
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
  privacy: {
    title: 'Aviso de privacidad',
    intro: 'Cómo cuidamos los datos que nos compartes al hacer un reporte.',
  },
} satisfies Record<string, PageCopy>
