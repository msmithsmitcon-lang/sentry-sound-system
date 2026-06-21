import {
  DEMO_WORKSPACE_NAME,
  resolveWorkspacePlanFromAssignment,
  WorkspacePlanAssignmentRow,
} from "./index"

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

const now = new Date("2026-05-17T12:00:00.000Z")

function validAssignment(
  overrides: Partial<WorkspacePlanAssignmentRow> = {}
): WorkspacePlanAssignmentRow {
  return {
    id: "assignment_1",
    workspace_id: "workspace_1",
    plan_key: "ARTIST_PRO",
    subscription_status: "active",
    source: "workspace_record_later",
    is_production_eligible: true,
    effective_from: "2026-05-01T00:00:00.000Z",
    effective_until: null,
    reason: "test",
    metadata: {},
    ...overrides,
  }
}

const demo = resolveWorkspacePlanFromAssignment({
  workspace: {
    id: "workspace_demo",
    name: DEMO_WORKSPACE_NAME,
    status: "active",
  },
  assignmentRows: [
    validAssignment({
      workspace_id: "workspace_demo",
      plan_key: "ARTIST_PRO",
      is_production_eligible: true,
    }),
  ],
  now,
})

assert(demo.planKey === "TEST_DEMO_PLAN", "Demo fallback must win.")
assert(!demo.isProductionEligible, "Demo fallback must remain TEST-only.")

const active = resolveWorkspacePlanFromAssignment({
  workspace: {
    id: "workspace_1",
    name: "Artist Workspace",
    status: "active",
  },
  assignmentRows: [validAssignment()],
  now,
})

assert(active.planKey === "ARTIST_PRO", "Valid active row must map plan key.")
assert(active.subscriptionStatus === "active", "Valid active row must map status.")
assert(active.source === "workspace_record_later", "Valid active row must map source.")
assert(active.isProductionEligible, "Valid production plan/status/flag may be eligible.")
assert(active.reasonCode === "WORKSPACE_PLAN_ACTIVE", "Valid row should be active.")

const missing = resolveWorkspacePlanFromAssignment({
  workspace: {
    id: "workspace_1",
    name: "Artist Workspace",
    status: "active",
  },
  assignmentRows: [],
  now,
})

assert(
  missing.reasonCode === "WORKSPACE_PLAN_NOT_CONFIGURED",
  "Missing row must fail closed as not configured."
)
assert(!missing.isProductionEligible, "Missing row must not be eligible.")

const expired = resolveWorkspacePlanFromAssignment({
  workspace: {
    id: "workspace_1",
    name: "Artist Workspace",
    status: "active",
  },
  assignmentRows: [
    validAssignment({
      effective_from: "2026-05-01T00:00:00.000Z",
      effective_until: "2026-05-10T00:00:00.000Z",
    }),
  ],
  now,
})

assert(expired.reasonCode === "WORKSPACE_PLAN_EXPIRED", "Expired row must fail closed.")
assert(!expired.isProductionEligible, "Expired row must not be eligible.")

const futureDated = resolveWorkspacePlanFromAssignment({
  workspace: {
    id: "workspace_1",
    name: "Artist Workspace",
    status: "active",
  },
  assignmentRows: [
    validAssignment({
      effective_from: "2026-06-01T00:00:00.000Z",
      effective_until: null,
    }),
  ],
  now,
})

assert(
  futureDated.reasonCode === "WORKSPACE_PLAN_FUTURE_DATED",
  "Future-dated row must fail closed."
)
assert(!futureDated.isProductionEligible, "Future-dated row must not be eligible.")

const conflict = resolveWorkspacePlanFromAssignment({
  workspace: {
    id: "workspace_1",
    name: "Artist Workspace",
    status: "active",
  },
  assignmentRows: [
    validAssignment({ id: "assignment_1" }),
    validAssignment({ id: "assignment_2", plan_key: "ARTIST_STARTER" }),
  ],
  now,
})

assert(
  conflict.reasonCode === "WORKSPACE_PLAN_CONFLICT",
  "Multiple active rows must fail closed as conflict."
)
assert(!conflict.isProductionEligible, "Conflicting rows must not be eligible.")

const malformedPlan = resolveWorkspacePlanFromAssignment({
  workspace: {
    id: "workspace_1",
    name: "Artist Workspace",
    status: "active",
  },
  assignmentRows: [validAssignment({ plan_key: "UNKNOWN_PLAN" })],
  now,
})

assert(
  malformedPlan.reasonCode === "WORKSPACE_PLAN_MALFORMED",
  "Unknown plan must fail closed as malformed."
)

const malformedStatus = resolveWorkspacePlanFromAssignment({
  workspace: {
    id: "workspace_1",
    name: "Artist Workspace",
    status: "active",
  },
  assignmentRows: [validAssignment({ subscription_status: "paid" })],
  now,
})

assert(
  malformedStatus.reasonCode === "WORKSPACE_PLAN_MALFORMED",
  "Unknown status must fail closed as malformed."
)

const malformedSource = resolveWorkspacePlanFromAssignment({
  workspace: {
    id: "workspace_1",
    name: "Artist Workspace",
    status: "active",
  },
  assignmentRows: [validAssignment({ source: "stripe" })],
  now,
})

assert(
  malformedSource.reasonCode === "WORKSPACE_PLAN_MALFORMED",
  "Unknown source must fail closed as malformed."
)

const suspendedWorkspace = resolveWorkspacePlanFromAssignment({
  workspace: {
    id: "workspace_1",
    name: "Artist Workspace",
    status: "suspended",
  },
  assignmentRows: [validAssignment()],
  now,
})

assert(
  suspendedWorkspace.reasonCode === "WORKSPACE_SUSPENDED",
  "Suspended workspace must fail closed before assignment mapping."
)
assert(
  suspendedWorkspace.subscriptionStatus === "suspended",
  "Suspended workspace must return suspended status."
)
assert(!suspendedWorkspace.isProductionEligible, "Suspended workspace cannot be eligible.")

const invalidStatusOverride = resolveWorkspacePlanFromAssignment({
  workspace: {
    id: "workspace_1",
    name: "Artist Workspace",
    status: "active",
  },
  assignmentRows: [
    validAssignment({
      subscription_status: "suspended",
      is_production_eligible: true,
    }),
  ],
  now,
})

assert(
  invalidStatusOverride.reasonCode === "WORKSPACE_PLAN_MALFORMED",
  "Production flag must not override invalid production status."
)
assert(
  !invalidStatusOverride.isProductionEligible,
  "Production flag alone must not authorize production."
)

console.log("Workspace plan assignment row mapper tests passed")
