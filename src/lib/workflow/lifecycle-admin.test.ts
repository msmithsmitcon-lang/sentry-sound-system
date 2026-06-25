import { LifecycleAdminRepository, getLifecycleSummary, recordLifecycleTransition } from "./lifecycle-admin"
import { LifecycleEvent } from "./lifecycle-event-builder"

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

const workspaceId = "11111111-1111-4111-8111-111111111111"

function createRepository(events: LifecycleEvent[] = []): LifecycleAdminRepository & {
  events: LifecycleEvent[]
} {
  return {
    events,
    async listLifecycleEvents(input) {
      return events
        .filter(
          (event) =>
            event.workspaceId === input.workspaceId &&
            event.entityType === input.entityType &&
            event.entityId === input.entityId
        )
        .slice(0, input.limit)
    },
    async createLifecycleEvent(event) {
      events.unshift(event)
      return event
    },
  }
}

async function run() {
  const repository = createRepository()
  const valid = await recordLifecycleTransition({
    repository,
    transition: {
      eventId: "lifecycle_test_1",
      workspaceId,
      entityType: "song",
      entityId: "song_1",
      currentState: "draft",
      nextState: "metadata_started",
      transitionKey: "song_capture.metadata_started",
      actorUserId: "user_1",
      reason: "TEST capture started",
      metadata: { source: "test" },
      occurredAt: "2026-05-18T12:00:00.000Z",
    },
  })

  assert(valid.ok, "Valid transition must be accepted.")
  assert(
    valid.ok && valid.data.event.productionActivation === false,
    "Lifecycle event must not activate production."
  )
  assert(
    valid.ok && valid.data.event.auditEvent.action === "lifecycle.song_capture.metadata_started",
    "Lifecycle event must include operational audit event shape."
  )

  const invalidTransition = await recordLifecycleTransition({
    repository,
    transition: {
      workspaceId,
      entityType: "song",
      entityId: "song_1",
      currentState: "draft",
      nextState: "ready_for_submission",
      transitionKey: "song_capture.skip",
    },
  })

  assert(!invalidTransition.ok, "Invalid transition must be rejected.")
  assert(
    !invalidTransition.ok &&
      invalidTransition.error.code === "INVALID_TRANSITION",
    "Invalid transition must return INVALID_TRANSITION."
  )

  const invalidEntityType = await recordLifecycleTransition({
    repository,
    transition: {
      workspaceId,
      entityType: "royalty",
      entityId: "royalty_1",
      currentState: "created",
      nextState: "updated",
      transitionKey: "royalty.updated",
    },
  })

  assert(!invalidEntityType.ok, "Invalid entity type must be rejected.")
  assert(
    !invalidEntityType.ok &&
      invalidEntityType.error.code === "INVALID_ENTITY_TYPE",
    "Invalid entity type must return INVALID_ENTITY_TYPE."
  )

  const blocked = await recordLifecycleTransition({
    repository,
    transition: {
      eventId: "lifecycle_test_2",
      workspaceId,
      entityType: "song",
      entityId: "song_1",
      currentState: "metadata_started",
      nextState: "blocked",
      transitionKey: "song_capture.blocked",
      occurredAt: "2026-05-18T12:01:00.000Z",
    },
  })

  assert(blocked.ok, "Blocked transition must be represented.")
  assert(
    blocked.ok && blocked.data.event.auditEvent.status === "blocked",
    "Blocked lifecycle transition must include blocked audit status."
  )

  const summary = await getLifecycleSummary({
    repository,
    workspaceId,
    entityType: "song",
    entityId: "song_1",
  })

  assert(summary.ok, "Lifecycle summary shape must succeed.")
  assert(
    summary.ok && summary.data.currentState === "blocked",
    "Summary must expose latest next state."
  )
  assert(
    summary.ok && summary.data.eventCount === 2,
    "Summary must count lifecycle events."
  )
  assert(
    summary.ok && summary.data.flags.productionActivation === false,
    "Summary must not activate production."
  )
  assert(
    summary.ok &&
      summary.data.warnings.some((warning) =>
        warning.includes("Song/submission/evidence workflows remain TEST-only")
      ),
    "Summary must include TEST-only warning."
  )

  console.log("Lifecycle admin tests passed")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
