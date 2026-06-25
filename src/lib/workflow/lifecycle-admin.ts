import { LIFECYCLE_TEST_MODE } from "./lifecycle-state"
import { buildLifecycleEvent, BuildLifecycleEventInput, LifecycleEvent } from "./lifecycle-event-builder"

export type LifecycleAdminRepository = {
  listLifecycleEvents(input: {
    workspaceId: string
    entityType: string
    entityId: string
    limit: number
  }): Promise<readonly LifecycleEvent[]>
  createLifecycleEvent(event: LifecycleEvent): Promise<LifecycleEvent>
}

export type LifecycleAdminResult<T> =
  | {
      ok: true
      mode: typeof LIFECYCLE_TEST_MODE
      data: T
    }
  | {
      ok: false
      mode: typeof LIFECYCLE_TEST_MODE
      error: {
        code: string
        message: string
      }
    }

export type LifecycleSummary = {
  workspaceId: string
  entityType: string
  entityId: string
  currentState: string | null
  lastTransitionKey: string | null
  lastOccurredAt: string | null
  eventCount: number
  events: readonly LifecycleEvent[]
  flags: {
    mode: typeof LIFECYCLE_TEST_MODE
    testInternalAdminOnly: true
    productionActivation: false
    productionWorkflowEngine: false
  }
  warnings: string[]
}

export async function getLifecycleSummary(input: {
  repository: LifecycleAdminRepository
  workspaceId?: string | null
  entityType?: string | null
  entityId?: string | null
  limit?: number
}): Promise<LifecycleAdminResult<LifecycleSummary>> {
  const workspaceId = normalizeRequiredString(input.workspaceId)
  const entityType = normalizeRequiredString(input.entityType)
  const entityId = normalizeRequiredString(input.entityId)

  if (!workspaceId) {
    return fail("WORKSPACE_ID_REQUIRED", "workspace_id is required.")
  }

  if (!entityType) {
    return fail("ENTITY_TYPE_REQUIRED", "entity_type is required.")
  }

  if (!entityId) {
    return fail("ENTITY_ID_REQUIRED", "entity_id is required.")
  }

  const events = await input.repository.listLifecycleEvents({
    workspaceId,
    entityType,
    entityId,
    limit: normalizeLimit(input.limit),
  })

  return succeed(buildLifecycleSummary({ workspaceId, entityType, entityId, events }))
}

export async function recordLifecycleTransition(input: {
  repository: LifecycleAdminRepository
  transition: BuildLifecycleEventInput
}): Promise<LifecycleAdminResult<{ event: LifecycleEvent; summary: LifecycleSummary; warnings: string[] }>> {
  const buildResult = buildLifecycleEvent(input.transition)

  if (!buildResult.ok) {
    return fail(buildResult.error.code, buildResult.error.message)
  }

  const event = await input.repository.createLifecycleEvent(buildResult.event)
  const events = await input.repository.listLifecycleEvents({
    workspaceId: event.workspaceId,
    entityType: event.entityType,
    entityId: event.entityId,
    limit: 50,
  })

  return succeed({
    event,
    summary: buildLifecycleSummary({
      workspaceId: event.workspaceId,
      entityType: event.entityType,
      entityId: event.entityId,
      events,
    }),
    warnings: testLifecycleWarnings(),
  })
}

export function buildLifecycleSummary(input: {
  workspaceId: string
  entityType: string
  entityId: string
  events: readonly LifecycleEvent[]
}): LifecycleSummary {
  const sortedEvents = [...input.events].sort((a, b) =>
    b.occurredAt.localeCompare(a.occurredAt)
  )
  const latest = sortedEvents[0]

  return {
    workspaceId: input.workspaceId,
    entityType: input.entityType,
    entityId: input.entityId,
    currentState: latest?.nextState ?? null,
    lastTransitionKey: latest?.transitionKey ?? null,
    lastOccurredAt: latest?.occurredAt ?? null,
    eventCount: input.events.length,
    events: sortedEvents,
    flags: {
      mode: LIFECYCLE_TEST_MODE,
      testInternalAdminOnly: true,
      productionActivation: false,
      productionWorkflowEngine: false,
    },
    warnings: testLifecycleWarnings(),
  }
}

export function testLifecycleWarnings(): string[] {
  return [
    "TEST/internal/admin support only.",
    "Lifecycle events do not activate production workflow automation.",
    "Lifecycle events are not wired into song/submission/evidence production routes.",
    "Song/submission/evidence workflows remain TEST-only.",
  ]
}

function normalizeRequiredString(value?: string | null): string | null {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

function normalizeLimit(limit?: number): number {
  if (!Number.isFinite(limit) || !limit) {
    return 50
  }

  return Math.min(Math.max(Math.trunc(limit), 1), 100)
}

function succeed<T>(data: T): LifecycleAdminResult<T> {
  return {
    ok: true,
    mode: LIFECYCLE_TEST_MODE,
    data,
  }
}

function fail<T = never>(code: string, message: string): LifecycleAdminResult<T> {
  return {
    ok: false,
    mode: LIFECYCLE_TEST_MODE,
    error: {
      code,
      message,
    },
  }
}
