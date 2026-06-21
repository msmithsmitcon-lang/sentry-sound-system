import { WorkspacePlanAssignmentRow } from "@/lib/entitlements/workspace-plan-assignment-row"
import {
  WorkspacePlanAssignmentWriteRecord,
  WorkspaceSubscriptionAdminRepository,
} from "@/lib/entitlements/workspace-subscription-admin"
import {
  WorkspaceOnboardingAdminRepository,
  WorkspaceOnboardingAdminWorkspace,
  WorkspaceOnboardingSettings,
  WorkspaceOnboardingWorkspaceUpdate,
} from "@/lib/workspace-onboarding/workspace-onboarding-admin"

import { getWorkspaceAdminOverview } from "./workspace-admin-overview"

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

const workspaceId = "11111111-1111-4111-8111-111111111111"
const now = new Date("2026-05-18T12:00:00.000Z")

function createRepositories(input?: {
  missingOnboardingWorkspace?: boolean
  missingSubscriptionWorkspace?: boolean
}) {
  const workspace: WorkspaceOnboardingAdminWorkspace = {
    id: workspaceId,
    name: "Sentry Sound Demo Workspace",
    legal_name: "Demo Pty Ltd",
    country_code: "ZA",
    base_currency: "ZAR",
    status: "active",
  }
  const settings: WorkspaceOnboardingSettings = {
    workspace_onboarding: {
      workspace_name: "Sentry Sound Demo Workspace",
      company_entity_name: "Demo Pty Ltd",
      country: "ZA",
      currency: "ZAR",
      vat_status: "pending",
      onboarding_step: "review",
      onboarding_status: "in_progress",
    },
  }
  const assignments: WorkspacePlanAssignmentRow[] = [
    {
      id: "assignment_1",
      workspace_id: workspaceId,
      plan_key: "TEST_DEMO_PLAN",
      subscription_status: "test_demo",
      source: "workspace_record_later",
      is_production_eligible: false,
      effective_from: "2026-05-01T00:00:00.000Z",
      effective_until: null,
      metadata: {},
    },
  ]

  const onboarding: WorkspaceOnboardingAdminRepository = {
    async getWorkspace() {
      return input?.missingOnboardingWorkspace ? null : workspace
    },
    async getWorkspaceSettings() {
      return settings
    },
    async updateWorkspaceIdentity(
      _workspaceId: string,
      update: WorkspaceOnboardingWorkspaceUpdate
    ) {
      return {
        ...workspace,
        ...update,
      }
    },
    async upsertWorkspaceSettings(
      _workspaceId: string,
      nextSettings: WorkspaceOnboardingSettings
    ) {
      return nextSettings
    },
  }

  const subscription: WorkspaceSubscriptionAdminRepository = {
    async getWorkspace() {
      return input?.missingSubscriptionWorkspace
        ? null
        : {
            id: workspace.id,
            name: workspace.name,
            status: workspace.status,
          }
    },
    async listWorkspacePlanAssignments() {
      return assignments
    },
    async insertWorkspacePlanAssignment(record: WorkspacePlanAssignmentWriteRecord) {
      return {
        id: "assignment_inserted",
        ...record,
      }
    },
    async updateWorkspacePlanAssignment(
      assignmentId: string,
      record: Partial<WorkspacePlanAssignmentWriteRecord>
    ) {
      return {
        ...assignments[0],
        ...record,
        id: assignmentId,
      }
    },
  }

  return { onboarding, subscription }
}

async function run() {
  const missingWorkspaceId = await getWorkspaceAdminOverview({
    repositories: createRepositories(),
    workspaceId: "",
    now,
  })

  assert(!missingWorkspaceId.ok, "Missing workspace id must fail.")
  assert(
    !missingWorkspaceId.ok &&
      missingWorkspaceId.error.code === "MISSING_WORKSPACE_ID",
    "Missing workspace id must return MISSING_WORKSPACE_ID."
  )

  const overview = await getWorkspaceAdminOverview({
    repositories: createRepositories(),
    workspaceId,
    now,
  })

  assert(overview.ok, "Valid workspace overview must succeed.")
  assert(
    overview.ok && overview.data.workspaceId === workspaceId,
    "Overview must include workspace id."
  )
  assert(
    overview.ok && overview.data.onboardingSummary.onboarding.country === "ZA",
    "Overview must include onboarding summary."
  )
  assert(
    overview.ok &&
      overview.data.subscriptionSummary.workspacePlan.planKey === "TEST_DEMO_PLAN",
    "Overview must include subscription summary."
  )
  assert(
    overview.ok &&
      overview.data.entitlementSummary.entitlementSummary.items.length > 0,
    "Overview must include entitlement/dashboard summary."
  )
  assert(
    overview.ok && overview.data.flags.testInternalAdminOnly === true,
    "Overview must include TEST/internal/admin flag."
  )
  assert(
    overview.ok && overview.data.flags.productionActivation === false,
    "Overview must not activate production."
  )
  assert(
    overview.ok &&
      overview.data.warnings.some((warning) =>
        warning.includes("Song/submission/evidence workflows remain TEST-only")
      ),
    "Overview must include TEST-only warning."
  )

  const missingOnboardingWorkspace = await getWorkspaceAdminOverview({
    repositories: createRepositories({ missingOnboardingWorkspace: true }),
    workspaceId,
    now,
  })

  assert(!missingOnboardingWorkspace.ok, "Missing onboarding workspace must fail.")
  assert(
    !missingOnboardingWorkspace.ok &&
      missingOnboardingWorkspace.error.source === "onboarding",
    "Missing onboarding workspace must identify onboarding as source."
  )

  console.log("Workspace admin overview service tests passed")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
