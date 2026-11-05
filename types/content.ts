import type { IconName } from '@/lib/icons'

export interface NavItem {
  href: string
  label: string
  icon: IconName
  /** Destaca el ítem (ej. "Reportar" en la barra inferior). */
  highlight?: boolean
}

export interface PageCopy {
  title: string
  intro: string
}

/** Niveles del sistema de alertas usado en Colombia. */
export type AlertLevelId = 'verde' | 'amarilla' | 'naranja' | 'roja'

export interface AlertLevelDefinition {
  id: AlertLevelId
  label: string
  meaning: string
  whatToDo: string
  icon: IconName
}

export interface AlertStatus {
  level: AlertLevelId
  title: string
  description: string
  updatedAt?: string
  source?: string
}

export type RiskPhaseId = 'antes' | 'durante' | 'despues'

export interface RiskPhaseDefinition {
  id: RiskPhaseId
  label: string
  description: string
  icon: IconName
}

export interface Risk {
  slug: string
  name: string
  icon: IconName
  summary: string
  whereInSector?: string
  warningSigns: string[]
  phases: Record<RiskPhaseId, string[]>
}

export type ContactGroupId = 'nacional' | 'jac' | 'sector'

export interface Contact {
  id: string
  name: string
  role: string
  phone: string
  /** Número tal como se muestra, ej. "123" o "300 123 4567". */
  displayPhone: string
  group: ContactGroupId
  icon: IconName
  priority?: 'emergencia' | 'normal'
}

export interface ContactGroup {
  id: ContactGroupId
  title: string
  description: string
}

export type NoticeKind = 'comunicado' | 'simulacro' | 'taller'

export interface Notice {
  id: string
  kind: NoticeKind
  title: string
  summary: string
  /** Fecha ISO (YYYY-MM-DD). */
  date: string
  time?: string
  place?: string
  /** Entrada en el sitio principal. */
  href: string
}

export interface NoticeKindDefinition {
  id: NoticeKind
  label: string
  icon: IconName
}

export type MapPointKind = 'encuentro' | 'ruta' | 'riesgo'

export interface MapPoint {
  id: string
  kind: MapPointKind
  name: string
  description: string
  reference: string
  /** Posición en el croquis, en porcentaje, de 0 a 100. */
  position: { x: number; y: number }
  /** Solo rutas: trazado en porcentaje dentro del croquis. */
  path?: Array<{ x: number; y: number }>
}

export interface MapPointKindDefinition {
  id: MapPointKind
  label: string
  description: string
  icon: IconName
}

export interface PlanStep {
  id: string
  title: string
  description: string
  icon: IconName
}

export interface KitItem {
  id: string
  label: string
  hint?: string
}

export interface KitCategory {
  id: string
  title: string
  items: KitItem[]
}

export interface CommitteeMember {
  id: string
  name: string
  role: string
}

export interface ParticipationWay {
  id: string
  title: string
  description: string
  icon: IconName
}

export interface AboutContent {
  mission: string
  vision: string
  committee: {
    title: string
    description: string
    members?: CommitteeMember[]
  }
  participate: {
    title: string
    description: string
    ways: ParticipationWay[]
  }
  meeting?: {
    title: string
    detail: string
  }
}
