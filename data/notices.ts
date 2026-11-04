import type { AlertStatus, Notice, NoticeKindDefinition } from '@/types/content'

export const currentAlert: AlertStatus = {
  level: 'amarilla',
  title: 'Alerta amarilla por temporada de lluvias',
  description:
    'Se esperan lluvias fuertes en los próximos días. Mantén limpios los desagües y evita acercarte a la quebrada.',
  updatedAt: '2026-11-04T07:30:00-05:00',
  source: 'Consejo Municipal de Gestión del Riesgo',
}

export const noticeKinds: NoticeKindDefinition[] = [
  { id: 'comunicado', label: 'Comunicado', icon: 'megaphone' },
  { id: 'simulacro', label: 'Simulacro', icon: 'siren' },
  { id: 'taller', label: 'Taller', icon: 'graduation' },
]

export const notices: Notice[] = [
  {
    id: 'aviso-lluvias',
    kind: 'comunicado',
    title: 'Recomendaciones por temporada de lluvias',
    summary: 'Revisa canales y techos, y reporta grietas o hundimientos en el terreno a la JAC.',
    date: '2026-11-04',
  },
  {
    id: 'simulacro-nacional',
    kind: 'simulacro',
    title: 'Simulacro de evacuación por sismo',
    summary: 'Participa con tu familia. Sonará la alarma y caminaremos juntos al punto de encuentro.',
    date: '2026-11-19',
    time: '9:00 a. m.',
    place: 'Punto de encuentro Cancha Múltiple',
  },
  {
    id: 'taller-primeros-auxilios',
    kind: 'taller',
    title: 'Taller de primeros auxilios básicos',
    summary: 'Aprende a atender heridas, quemaduras y desmayos. Cupos limitados, inscríbete con tu líder de sector.',
    date: '2026-11-22',
    time: '2:00 p. m.',
    place: 'Salón Comunal El Castillo',
  },
  {
    id: 'jornada-limpieza',
    kind: 'comunicado',
    title: 'Jornada de limpieza de la quebrada',
    summary: 'Ayúdanos a retirar basura y escombros para prevenir inundaciones. Lleva guantes y botas.',
    date: '2026-11-29',
    time: '7:00 a. m.',
    place: 'Puente de la Quebrada',
  },
  {
    id: 'taller-plan-familiar',
    kind: 'taller',
    title: 'Arma tu plan familiar de emergencia',
    summary: 'Te acompañamos a llenar el plan y a preparar el kit con lo que tienes en casa.',
    date: '2026-12-06',
    time: '10:00 a. m.',
    place: 'Salón Comunal El Castillo',
  },
]
