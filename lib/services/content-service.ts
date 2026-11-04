import { aboutContent } from '@/data/about'
import { mapPoints } from '@/data/map-points'
import { currentAlert, notices } from '@/data/notices'
import { emergencyKit, familyPlanSteps } from '@/data/preparedness'
import { risks } from '@/data/risks'
import type {
  AboutContent,
  AlertStatus,
  KitCategory,
  MapPoint,
  Notice,
  PlanStep,
  Risk,
} from '@/types/content'

/**
 * Contrato de lectura del contenido del sitio. Las páginas dependen de esta
 * interfaz; hoy la implementa un mock con /data y mañana puede ser una API.
 */
export interface ContentService {
  getCurrentAlert(): Promise<AlertStatus>
  getRisks(): Promise<Risk[]>
  getRisk(slug: string): Promise<Risk | undefined>
  getNotices(options?: { limit?: number }): Promise<Notice[]>
  getMapPoints(): Promise<MapPoint[]>
  getFamilyPlan(): Promise<PlanStep[]>
  getEmergencyKit(): Promise<KitCategory[]>
  getAbout(): Promise<AboutContent>
}

const byDateDesc = (a: Notice, b: Notice) => b.date.localeCompare(a.date)

export const mockContentService: ContentService = {
  async getCurrentAlert() {
    return currentAlert
  },
  async getRisks() {
    return risks
  },
  async getRisk(slug) {
    return risks.find((risk) => risk.slug === slug)
  },
  async getNotices(options) {
    const sorted = [...notices].sort(byDateDesc)
    return options?.limit ? sorted.slice(0, options.limit) : sorted
  },
  async getMapPoints() {
    return mapPoints
  },
  async getFamilyPlan() {
    return familyPlanSteps
  },
  async getEmergencyKit() {
    return emergencyKit
  },
  async getAbout() {
    return aboutContent
  },
}
