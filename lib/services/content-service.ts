import { cache } from 'react'
import { toContent, type Content } from '@/lib/wp/content'
import { wpJson } from '@/lib/wp/client'
import type { AlertStatus, CommitteeMember, Contact, MapPoint, Notice } from '@/types/content'

export interface ContentService {
  getCurrentAlert(): Promise<AlertStatus | null>
  getNotices(options?: { limit?: number }): Promise<Notice[]>
  getUpcomingNotices(options?: { limit?: number }): Promise<Notice[]>
  getContacts(): Promise<Contact[]>
  getCommittee(): Promise<CommitteeMember[]>
  /** `null` cuando no se pudo leer WordPress, para no confundirlo con "no hay puntos". */
  getMapPoints(): Promise<MapPoint[] | null>
}

const EMPTY: Content = { alert: null, notices: [], upcoming: [], contacts: [], committee: [], points: [] }

interface Loaded {
  content: Content
  available: boolean
}

const load = cache(async (): Promise<Loaded> => {
  try {
    return { content: toContent(await wpJson('/wp-json/jac-gr/v1/contenido')), available: true }
  } catch (error) {
    console.error('No se pudo leer el contenido de WordPress', error)
    return { content: EMPTY, available: false }
  }
})

const loadContent = async (): Promise<Content> => (await load()).content

export const contentService: ContentService = {
  getCurrentAlert: async () => (await loadContent()).alert,
  getNotices: async ({ limit } = {}) => (await loadContent()).notices.slice(0, limit),
  getUpcomingNotices: async ({ limit } = {}) => (await loadContent()).upcoming.slice(0, limit),
  getContacts: async () => (await loadContent()).contacts,
  getCommittee: async () => (await loadContent()).committee,
  getMapPoints: async () => {
    const { content, available } = await load()
    return available ? content.points : null
  },
}
