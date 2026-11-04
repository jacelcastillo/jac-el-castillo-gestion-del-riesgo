import type { IconName } from '@/lib/icons'

export type IncidentTypeId =
  | 'deslizamiento'
  | 'inundacion'
  | 'incendio'
  | 'sismo'
  | 'vendaval'
  | 'electrico'
  | 'otro'

export type IncidentSeverity = 'baja' | 'media' | 'alta'

export type PeopleAffected = 'si' | 'no' | 'no_se'

export type IncidentStatus = 'pendiente' | 'enviado' | 'en_atencion' | 'cerrado'

export type LocationMode = 'gps' | 'manual'

export interface IncidentLocation {
  mode: LocationMode
  latitude?: number
  longitude?: number
  accuracy?: number
  address?: string
  reference?: string
}

export interface IncidentPhoto {
  dataUrl: string
  width: number
  height: number
  sizeKb: number
}

export interface IncidentContact {
  anonymous: boolean
  name?: string
  phone?: string
}

/** Datos que captura el formulario. */
export interface IncidentDraft {
  type: IncidentTypeId
  location: IncidentLocation
  description: string
  severity: IncidentSeverity
  peopleAffected: PeopleAffected
  photo?: IncidentPhoto
  contact: IncidentContact
}

/** Reporte persistido (local o remoto). */
export interface IncidentReport extends IncidentDraft {
  id: string
  createdAt: string
  updatedAt: string
  status: IncidentStatus
  remoteId?: string
  lastSyncError?: string
}

export interface OptionDefinition<T extends string> {
  id: T
  label: string
  description?: string
  icon?: IconName
}

export interface IncidentStatusDefinition {
  id: IncidentStatus
  label: string
  description: string
  icon: IconName
}

export interface ReportStepDefinition {
  id: string
  title: string
  description: string
  /** Campos del formulario que se validan antes de avanzar. */
  fields: Array<keyof IncidentDraft>
}
