import { buildOperationalAuditEvent } from "./operational-audit-event-builder"
import {
  buildOperationalAuditEventSummary,
  createOperationalAuditEvent,
  listOperationalAuditEvents,
  OperationalAuditEvent,
  OperationalAuditEventRepository,
} from "./operational-audit-event"

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

const workspaceId = "11111111-1111-4111-8111-111111111111"

function createRepository(
  events: OperationalAuditEvent[] = []
): OperationalAuditEventRepository & { events: OperationalAuditEvent[] } {
  return {
    events,
    async listEvents(input) {
      return events
        .filter((event) => event.workspaceId === input.workspaceId)
        .slice(0, input.limit)
    },
    async createEvent(event) {
      events.unshift(event)
      return event
    },
  }
}

function validInput(status = "success") {
  return {
    eventId: `event_${status}`,
    workspaceId,
    actorUserId: "user_1",
    actorDisplayName: "Test User",
    actorEmail: "test@example.com",
    action: `audit.${status}`,
    resourceType: "workspace",
    resourceId: workspaceId,
    resourceLabel: "Demo Workspace",
    category: "workspace",
    severity: status === "failed" ? "error" : "info",
    status,
    ipAddress: "127.0.0.1",
    userAgent: "tsx-test",
    metadata: { test: true },
    occurredAt: `2026-05-18T12:00:0${status.length % 4}.000Z`,
  }
}

async function run() {
  const valid = buildOperationalAuditEvent(validInput())

  assert(valid.ok, "Valid audit event must build.")
  assert(
    valid.ok && valid.event.productionActivation === false,
    "Built audit event must not activate production."
  )

  const invalidCategory = buildOperationalAuditEvent({
    ...validInput(),
    category: "royalties",
  })

  assert(!invalidCategory.ok, "Invalid category must fail.")
  assert(
    !invalidCategory.ok &&
      invalidCategory.error.code === "INVALID_CATEGORY",
    "Invalid category must return INVALID_CATEGORY."
  )

  const invalidSeverity = buildOperationalAuditEvent({
    ...validInput(),
    severity: "critical",
  })

  assert(!invalidSeverity.ok, "Invalid severity must fail.")
  assert(
    !invalidSeverity.ok &&
      invalidSeverity.error.code === "INVALID_SEVERITY",
    "Invalid severity must return INVALID_SEVERITY."
  )

  const invalidStatus = buildOperationalAuditEvent({
    ...validInput(),
    status: "done",
  })

  assert(!invalidStatus.ok, "Invalid status must fail.")
  assert(
    !invalidStatus.ok && invalidStatus.error.code === "INVALID_STATUS",
    "Invalid status must return INVALID_STATUS."
  )

  const repository = createRepository()

  for (const status of ["success", "blocked", "failed"] as const) {
    const created = await createOperationalAuditEvent({
      repository,
      event: validInput(status),
    })

    assert(created.ok, `${status} event must be created.`)
  }

  const listed = await listOperationalAuditEvents({
    repository,
    workspaceId,
  })

  assert(listed.ok, "List shape must succeed.")
  assert(
    listed.ok && listed.data.events.length === 3,
    "List must include created events."
  )

  const summary = buildOperationalAuditEventSummary({
    workspaceId,
    events: repository.events,
  })

  assert(summary.totalEvents === 3, "Summary must count events.")
  assert(summary.byStatus.success === 1, "Summary must represent success.")
  assert(summary.byStatus.blocked === 1, "Summary must represent blocked.")
  assert(summary.byStatus.failed === 1, "Summary must represent failed.")
  assert(
    summary.flags.productionActivation === false,
    "Summary must not activate production."
  )
  assert(
    summary.warnings.some((warning) =>
      warning.includes("Song/submission/evidence workflows remain TEST-only")
    ),
    "Summary must preserve TEST-only warning."
  )

  console.log("Operational audit event tests passed")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
