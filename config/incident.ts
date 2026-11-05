import type {
  IncidentSeverity,
  IncidentStatus,
  IncidentStatusDefinition,
  IncidentTypeId,
  OptionDefinition,
  PeopleAffected,
  ReportStepDefinition,
} from '@/types/incident'

export const incidentTypes: OptionDefinition<IncidentTypeId>[] = [
  { id: 'deslizamiento', label: 'Deslizamiento', description: 'Caída de tierra o piedras', icon: 'mountain' },
  { id: 'inundacion', label: 'Inundación', description: 'Agua que se desborda', icon: 'droplets' },
  { id: 'incendio', label: 'Incendio', description: 'Fuego en casa o monte', icon: 'flame' },
  { id: 'sismo', label: 'Sismo', description: 'Daños por temblor', icon: 'activity' },
  { id: 'vendaval', label: 'Vendaval', description: 'Vientos fuertes, techos caídos', icon: 'wind' },
  { id: 'electrico', label: 'Riesgo eléctrico', description: 'Cables caídos o chispas', icon: 'zap' },
  { id: 'otro', label: 'Otro', description: 'Otra situación de riesgo', icon: 'alert' },
]

export const severityOptions: OptionDefinition<IncidentSeverity>[] = [
  { id: 'baja', label: 'Baja', description: 'No hay peligro inmediato' },
  { id: 'media', label: 'Media', description: 'Puede empeorar pronto' },
  { id: 'alta', label: 'Alta', description: 'Hay peligro ahora mismo' },
]

export const peopleAffectedOptions: OptionDefinition<PeopleAffected>[] = [
  { id: 'si', label: 'Sí' },
  { id: 'no', label: 'No' },
  { id: 'no_se', label: 'No sé' },
]

export const incidentStatuses: Record<IncidentStatus, IncidentStatusDefinition> = {
  pendiente: {
    id: 'pendiente',
    label: 'Pendiente de envío',
    description: 'Guardado en tu celular. Se enviará al volver la conexión.',
    icon: 'radio',
  },
  enviado: {
    id: 'enviado',
    label: 'Enviado',
    description: 'El comité recibió tu reporte.',
    icon: 'check',
  },
  en_atencion: {
    id: 'en_atencion',
    label: 'En atención',
    description: 'El comité está atendiendo la situación.',
    icon: 'users',
  },
  cerrado: {
    id: 'cerrado',
    label: 'Cerrado',
    description: 'La situación fue atendida.',
    icon: 'flag',
  },
}

export const reportSteps: ReportStepDefinition[] = [
  { id: 'tipo', title: '¿Qué tipo de incidente es?', description: 'Elige la opción que más se parezca.', fields: ['type'] },
  { id: 'ubicacion', title: '¿Dónde está pasando?', description: 'Comparte tu ubicación o escribe la dirección.', fields: ['location'] },
  { id: 'detalles', title: 'Cuéntanos más', description: 'Entre más claro, mejor podemos ayudar.', fields: ['description', 'severity', 'peopleAffected'] },
  { id: 'foto', title: 'Agrega una foto', description: 'Es opcional. Solo si es seguro tomarla.', fields: ['photo'] },
  { id: 'contacto', title: 'Tus datos de contacto', description: 'Son opcionales. Puedes enviar de forma anónima.', fields: ['contact'] },
  { id: 'resumen', title: 'Confirma y envía', description: 'Revisa que todo esté bien.', fields: ['consent'] },
]

export const validationMessages = {
  typeRequired: 'Elige el tipo de incidente.',
  locationRequired: 'Usa tu ubicación o escribe la dirección o el barrio.',
  addressTooShort: 'Escribe una dirección o barrio un poco más completo.',
  descriptionMin: 'Cuéntanos un poco más (mínimo 10 letras).',
  descriptionMax: 'La descripción es muy larga (máximo 600 letras).',
  severityRequired: 'Elige qué tan grave es.',
  peopleRequired: 'Dinos si hay personas afectadas.',
  nameRequired: 'Escribe tu nombre o marca "Enviar de forma anónima".',
  consentRequired: 'Para enviar el reporte debes autorizar el tratamiento de tus datos.',
  phoneInvalid: 'Escribe un celular válido de 10 números (ej: 3001234567).',
} as const

/** Límites para comprimir la foto en el cliente. */
export const photoCompression = {
  maxDimension: 1280,
  quality: 0.7,
  maxSizeKb: 350,
} as const
