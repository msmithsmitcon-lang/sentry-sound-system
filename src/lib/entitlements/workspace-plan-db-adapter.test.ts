import {
  DEMO_WORKSPACE_NAME,
  resolveWorkspacePlanDbAdapter,
  WorkspacePlanAssignmentRow,
} from "./index"

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

const now = new Date("2026-05-18T12:00:00.000Z")

const activeWorkspace = {
  id: "workspace_1",
  name: "Artist Workspace",
  status: "active",
}

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

async function run() {
  const emptyDbResult = await resolveWorkspacePlanDbAdapter({
    workspace: activeWorkspace,
    assignmentRows: [],
    now,
  })

  assert(
    emptyDbResult.reasonCode === "WORKSPACE_PLAN_NOT_CONFIGURED",
    "Empty DB result must fail closed as not configured."
  )
  assert(!emptyDbResult.isProductionEligible, "Empty DB result must not be eligible.")

  const singleValidRow = await resolveWorkspacePlanDbAdapter({
    workspace: activeWorkspace,
    assignmentRows: [validAssignment()],
    now,
  })

  assert(
    singleValidRow.reasonCode === "WORKSPACE_PLAN_ACTIVE",
    "Single valid row must resolve as active."
  )
  assert(singleValidRow.planKey === "ARTIST_PRO", "Single valid row must map plan.")
  assert(singleValidRow.isProductionEligible, "Single valid row may be eligible.")

  const expiredRow = await resolveWorkspacePlanDbAdapter({
    workspace: activeWorkspace,
    assignmentRows: [
      validAssignment({
        effective_until: "2026-05-10T00:00:00.000Z",
      }),
    ],
    now,
  })

  assert(
    expiredRow.reasonCode === "WORKSPACE_PLAN_EXPIRED",
    "Expired row must fail closed."
  )
  assert(!expiredRow.isProductionEligible, "Expired row must not be eligible.")

  const futureRow = await resolveWorkspacePlanDbAdapter({
    workspace: activeWorkspace,
    assignmentRows: [
      validAssignment({
        effective_from: "2026-06-01T00:00:00.000Z",
      }),
    ],
    now,
  })

  assert(
    futureRow.reasonCode === "WORKSPACE_PLAN_FUTURE_DATED",
    "Future row must fail closed."
  )
  assert(!futureRow.isProductionEligible, "Future row must not be eligible.")

  const malformedRow = await resolveWorkspacePlanDbAdapter({
    workspace: activeWorkspace,
    assignmentRows: [validAssignment({ plan_key: "UNKNOWN_PLAN" })],
    now,
  })

  assert(
    malformedRow.reasonCode === "WORKSPACE_PLAN_MALFORMED",
    "Malformed row must fail closed."
  )

  const multipleActiveRows = await resolveWorkspacePlanDbAdapter({
    workspace: activeWorkspace,
    assignmentRows: [
      validAssignment({ id: "assignment_1" }),
      validAssignment({ id: "assignment_2", plan_key: "ARTIST_STARTER" }),
    ],
    now,
  })

  assert(
    multipleActiveRows.reasonCode === "WORKSPACE_PLAN_CONFLICT",
    "Multiple active rows must fail closed as conflict."
  )
  assert(!multipleActiveRows.isProductionEligible, "Conflict must not be eligible.")

  const suspendedWorkspace = await resolveWorkspacePlanDbAdapter({
    workspace: {
      ...activeWorkspace,
      status: "suspended",
    },
    assignmentRows: [validAssignment()],
    now,
  })

  assert(
    suspendedWorkspace.reasonCode === "WORKSPACE_SUSPENDED",
    "Suspended workspace must fail closed."
  )
  assert(
    suspendedWorkspace.subscriptionStatus === "suspended",
    "Suspended workspace must return suspended status."
  )
  assert(!suspendedWorkspace.isProductionEligible, "Suspended workspace must not be eligible.")

  const demoFallback = await resolveWorkspacePlanDbAdapter({
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

  assert(demoFallback.planKey === "TEST_DEMO_PLAN", "Demo fallback must win.")
  assert(!demoFallback.isProductionEligible, "Demo fallback must remain TEST-only.")

  const injectedFetchFailure = await resolveWorkspacePlanDbAdapter({
    workspace: activeWorkspace,
    fetchAssignmentRows: async () => {
      throw new Error("database unavailable")
    },
    now,
  })

  assert(
    injectedFetchFailure.reasonCode === "WORKSPACE_PLAN_NOT_CONFIGURED",
    "Injected fetch failure must fail closed."
  )
  assert(
    !injectedFetchFailure.isProductionEligible,
    "Injected fetch failure must not be eligible."
  )

  let fetchedWorkspaceId: string | null = null
  const injectedFetchSuccess = await resolveWorkspacePlanDbAdapter({
    workspace: activeWorkspace,
    fetchAssignmentRows: async ({ workspaceId }) => {
      fetchedWorkspaceId = workspaceId
      return [validAssignment()]
    },
    now,
  })

  assert(fetchedWorkspaceId === "workspace_1", "Fetcher must receive workspace id.")
  assert(
    injectedFetchSuccess.reasonCode === "WORKSPACE_PLAN_ACTIVE",
    "Injected fetch success must delegate to mapper."
  )

  console.log("Workspace plan DB adapter tests passed")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
