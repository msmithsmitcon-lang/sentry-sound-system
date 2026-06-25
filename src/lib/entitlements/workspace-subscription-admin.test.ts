import {
  assignWorkspacePlan,
  getWorkspaceEntitlementSummary,
  getWorkspaceSubscriptionSummary,
  WorkspacePlanAssignmentRow,
  WorkspacePlanAssignmentWriteRecord,
  WorkspaceSubscriptionAdminRepository,
} from "./workspace-subscription-admin"

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

const now = new Date("2026-05-18T12:00:00.000Z")
const workspace = {
  id: "workspace_1",
  name: "Test Workspace",
  status: "active",
}

function createRepository(input?: {
  workspaceMissing?: boolean
  assignments?: WorkspacePlanAssignmentRow[]
}): WorkspaceSubscriptionAdminRepository & {
  inserts: WorkspacePlanAssignmentWriteRecord[]
  updates: Array<{ assignmentId: string; record: Partial<WorkspacePlanAssignmentWriteRecord> }>
} {
  const assignments = [...(input?.assignments ?? [])]
  const inserts: WorkspacePlanAssignmentWriteRecord[] = []
  const updates: Array<{
    assignmentId: string
    record: Partial<WorkspacePlanAssignmentWriteRecord>
  }> = []

  return {
    inserts,
    updates,
    async getWorkspace() {
      return input?.workspaceMissing ? null : workspace
    },
    async listWorkspacePlanAssignments() {
      return assignments
    },
    async insertWorkspacePlanAssignment(record) {
      inserts.push(record)
      const row: WorkspacePlanAssignmentRow = {
        id: "assignment_inserted",
        ...record,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      }
      assignments.push(row)
      return row
    },
    async updateWorkspacePlanAssignment(assignmentId, record) {
      updates.push({ assignmentId, record })
      const index = assignments.findIndex((row) => row.id === assignmentId)
      const row = {
        ...assignments[index],
        ...record,
        id: assignmentId,
      } as WorkspacePlanAssignmentRow
      assignments[index] = row
      return row
    },
  }
}

async function run() {
  const invalidPlan = await assignWorkspacePlan({
    repository: createRepository(),
    assignment: {
      workspaceId: "workspace_1",
      planKey: "NOT_A_PLAN",
      subscriptionStatus: "active",
      source: "workspace_record_later",
    },
    now,
  })

  assert(!invalidPlan.ok, "Invalid plan must be blocked.")
  assert(
    !invalidPlan.ok && invalidPlan.error.code === "INVALID_PLAN_KEY",
    "Invalid plan must return INVALID_PLAN_KEY."
  )

  const missingWorkspace = await getWorkspaceSubscriptionSummary({
    repository: createRepository({ workspaceMissing: true }),
    workspaceId: "workspace_missing",
    now,
  })

  assert(!missingWorkspace.ok, "Missing workspace must fail.")
  assert(
    !missingWorkspace.ok && missingWorkspace.error.code === "WORKSPACE_NOT_FOUND",
    "Missing workspace must return WORKSPACE_NOT_FOUND."
  )

  const insertRepository = createRepository()
  const inserted = await assignWorkspacePlan({
    repository: insertRepository,
    assignment: {
      workspaceId: "workspace_1",
      planKey: "TEST_DEMO_PLAN",
      subscriptionStatus: "test_demo",
      source: "workspace_record_later",
      isProductionEligible: true,
      actorId: "tester",
    },
    now,
  })

  assert(inserted.ok, "Valid assignment insert must succeed.")
  assert(insertRepository.inserts.length === 1, "Insert must write one assignment.")
  assert(
    insertRepository.inserts[0].is_production_eligible === false,
    "TEST_DEMO_PLAN must remain non-production eligible even if requested."
  )

  const updateRepository = createRepository({
    assignments: [
      {
        id: "assignment_existing",
        workspace_id: "workspace_1",
        plan_key: "ARTIST_STARTER",
        subscription_status: "active",
        source: "workspace_record_later",
        is_production_eligible: false,
        effective_from: "2026-05-01T00:00:00.000Z",
        effective_until: null,
        metadata: {},
      },
    ],
  })

  const updated = await assignWorkspacePlan({
    repository: updateRepository,
    assignment: {
      workspaceId: "workspace_1",
      planKey: "ARTIST_PRO",
      subscriptionStatus: "active",
      source: "admin_override_later",
      isProductionEligible: true,
    },
    now,
  })

  assert(updated.ok, "Valid assignment update must succeed.")
  assert(updateRepository.updates.length === 1, "Update must write one assignment.")
  assert(
    updateRepository.updates[0].assignmentId === "assignment_existing",
    "Update must target current assignment."
  )
  assert(
    updateRepository.updates[0].record.is_production_eligible === true,
    "Valid non-TEST active plan may preserve requested production eligibility flag for future enforcement."
  )

  const summary = await getWorkspaceSubscriptionSummary({
    repository: updateRepository,
    workspaceId: "workspace_1",
    now,
  })

  assert(summary.ok, "Summary shape must succeed.")
  assert(
    summary.ok && summary.data.workspace.id === "workspace_1",
    "Summary must include workspace."
  )
  assert(
    summary.ok && Array.isArray(summary.data.notices),
    "Summary must include TEST/admin notices."
  )

  const entitlementSummary = await getWorkspaceEntitlementSummary({
    repository: updateRepository,
    workspaceId: "workspace_1",
    now,
  })

  assert(entitlementSummary.ok, "Entitlement summary shape must succeed.")
  assert(
    entitlementSummary.ok &&
      entitlementSummary.data.entitlementSummary.items.length > 0,
    "Entitlement summary must include dashboard entitlement items."
  )
  assert(
    entitlementSummary.ok &&
      entitlementSummary.data.entitlementSummary.items.every(
        (item) => item.productionReady === false
      ),
    "Entitlement summary must not imply production readiness."
  )

  console.log("Workspace subscription admin service tests passed")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
