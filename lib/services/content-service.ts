import { cache } from 'react'
import { toContent, type Content } from '@/lib/wp/content'
import { wpJson } from '@/lib/wp/client'
import type { AlertStatus, CommitteeMember, Contact, Notice } from '@/types/content'

export interface ContentService {
  getCurrentAlert(): Promise<AlertStatus | null>
  getNotices(options?: { limit?: number }): Promise<Notice[]>
  getContacts(): Promise<Contact[]>
  getCommittee(): Promise<CommitteeMember[]>
}

const EMPTY: Content = { alert: null, notices: [], contacts: [], committee: [] }

const loadContent = cache(async (): Promise<Content> => {
  try {
    return toContent(await wpJson('/wp-json/jac-gr/v1/contenido'))
  } catch (error) {
    console.error('No se pudo leer el contenido de WordPress', error)
    return EMPTY
  }
})

export const contentService: ContentService = {
  getCurrentAlert: async () => (await loadContent()).alert,
  getNotices: async ({ limit } = {}) => (await loadContent()).notices.slice(0, limit),
  getContacts: async () => (await loadContent()).contacts,
  getCommittee: async () => (await loadContent()).committee,
}
