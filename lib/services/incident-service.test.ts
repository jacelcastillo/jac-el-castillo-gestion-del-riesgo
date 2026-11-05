import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import type { IncidentRepository } from '../repositories/incident-repository.ts'
import type { IncidentDraft, IncidentReport } from '../../types/incident.ts'
import { createMockIncidentApi } from './incident-api.mock.ts'
import { createIncidentService } from './incident-service.ts'

function createMemoryRepository(): IncidentRepository {
  const store = new Map<string, IncidentReport>()
  return {
    async save(report) {
      store.set(report.id, report)
    },
    async getAll() {
      return [...store.values()]
    },
    async getById(id) {
      return store.get(id)
    },
    async getByStatus(status) {
      return [...store.values()].filter((report) => report.status === status)
    },
    async update(id, changes) {
      const current = store.get(id)
      if (!current) return undefined
      const next = { ...current, ...changes }
      store.set(id, next)
      return next
    },
  }
}

const draft: IncidentDraft = {
  type: 'incendio',
  location: { mode: 'manual', address: 'Calle 5 # 3-20' },
  description: 'Humo saliendo de un lote baldío.',
  severity: 'alta',
  peopleAffected: 'no_se',
  contact: { anonymous: true },
  consent: true,
}

describe('incident service', () => {
  it('marks a report enviado when the API accepts it', async () => {
    const { api } = createMockIncidentApi()
    const service = createIncidentService(createMemoryRepository(), api)
    const report = await service.create(draft)
    assert.equal(report.status, 'enviado')
    assert.ok(report.remoteId)
  })

  it('keeps a report pendiente with lastSyncError when the API fails', async () => {
    const { api } = createMockIncidentApi({ failWith: new Error('WordPress caído') })
    const repository = createMemoryRepository()
    const service = createIncidentService(repository, api)
    const report = await service.create(draft)
    assert.equal(report.status, 'pendiente')
    const stored = await repository.getById(report.id)
    assert.equal(stored?.status, 'pendiente')
    assert.equal(stored?.lastSyncError, 'WordPress caído')
  })

  it('sends each pending report once when syncPending runs concurrently', async () => {
    const repository = createMemoryRepository()
    const failing = createIncidentService(repository, createMockIncidentApi({ failWith: new Error('x') }).api)
    await failing.create(draft)
    await failing.create(draft)

    const { api, submittedIds } = createMockIncidentApi({ latencyMs: 20 })
    const service = createIncidentService(repository, api)
    const results = await Promise.all([service.syncPending(), service.syncPending(), service.syncPending()])

    assert.deepEqual(results, [2, 2, 2])
    assert.equal(submittedIds.length, 2)
    assert.equal(new Set(submittedIds).size, 2)
  })

  describe('refreshStatuses', () => {
    it('asks once for all sent reports and applies the changed statuses', async () => {
      const repository = createMemoryRepository()
      const first = await createIncidentService(repository, createMockIncidentApi().api).create(draft)
      const second = await createIncidentService(repository, createMockIncidentApi().api).create(draft)
      const { api, statusCalls } = createMockIncidentApi({
        statuses: { [first.id]: 'en_atencion', [second.id]: 'cerrado' },
      })
      const service = createIncidentService(repository, api)

      await service.refreshStatuses()

      assert.equal(statusCalls.length, 1)
      assert.deepEqual(new Set(statusCalls[0]), new Set([first.id, second.id]))
      assert.equal((await repository.getById(first.id))?.status, 'en_atencion')
      assert.equal((await repository.getById(second.id))?.status, 'cerrado')
    })

    it('leaves a report unchanged when the answer omits its id or the API fails', async () => {
      const repository = createMemoryRepository()
      const report = await createIncidentService(repository, createMockIncidentApi().api).create(draft)

      await createIncidentService(repository, createMockIncidentApi().api).refreshStatuses()
      await createIncidentService(repository, createMockIncidentApi({ statusFailWith: new Error('x') }).api).refreshStatuses()

      assert.equal((await repository.getById(report.id))?.status, 'enviado')
    })

    it('makes no call when no report is waiting on a status', async () => {
      const repository = createMemoryRepository()
      const failing = createIncidentService(repository, createMockIncidentApi({ failWith: new Error('x') }).api)
      await failing.create(draft)
      const { api, statusCalls } = createMockIncidentApi()

      await createIncidentService(repository, api).refreshStatuses()

      assert.equal(statusCalls.length, 0)
    })

    it('makes no second call within 60 seconds', async () => {
      const repository = createMemoryRepository()
      await createIncidentService(repository, createMockIncidentApi().api).create(draft)
      const { api, statusCalls } = createMockIncidentApi()
      const service = createIncidentService(repository, api)

      await service.refreshStatuses()
      await service.refreshStatuses()

      assert.equal(statusCalls.length, 1)
    })
  })
})
