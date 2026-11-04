import type { IncidentReport } from '@/types/incident'
import type { IncidentRepository } from './incident-repository'

const DB_NAME = 'jac-el-castillo-riesgo'
const DB_VERSION = 1
const STORE = 'incidents'

function promisify<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' })
        store.createIndex('status', 'status')
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export function createIndexedDbIncidentRepository(): IncidentRepository {
  let dbPromise: Promise<IDBDatabase> | null = null
  const getDb = () => (dbPromise ??= openDatabase())

  async function withStore<T>(
    mode: IDBTransactionMode,
    run: (store: IDBObjectStore) => IDBRequest<T>,
  ): Promise<T> {
    const db = await getDb()
    const store = db.transaction(STORE, mode).objectStore(STORE)
    return promisify(run(store))
  }

  return {
    async save(report) {
      await withStore('readwrite', (store) => store.put(report))
    },
    async getAll() {
      const all = await withStore<IncidentReport[]>('readonly', (store) => store.getAll())
      return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    },
    async getById(id) {
      return withStore<IncidentReport | undefined>('readonly', (store) => store.get(id))
    },
    async getByStatus(status) {
      return withStore<IncidentReport[]>('readonly', (store) =>
        store.index('status').getAll(status),
      )
    },
    async update(id, changes) {
      const current = await this.getById(id)
      if (!current) return undefined
      const updated: IncidentReport = {
        ...current,
        ...changes,
        updatedAt: new Date().toISOString(),
      }
      await this.save(updated)
      return updated
    },
  }
}
