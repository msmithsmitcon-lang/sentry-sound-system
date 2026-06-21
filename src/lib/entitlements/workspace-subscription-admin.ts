import { buildDashboardEntitlementSummary } from "./dashboard-entitlement-summary"
import { isWorkspacePlanKey, workspacePlanRegistryByKey } from "./plan-registry"
import { resolveWorkspacePlanDbAdapter } from "./resolve-workspace-plan-db-adapter"
import {
  isWorkspacePlanSource,
  isWorkspaceSubscriptionStatus,
  WorkspacePlanAssignmentRow,
} from "./workspace-plan-assignment-row"
import { WorkspacePlanContext } from "./workspace-plan-status"

export const WORKSPACE_SUBSCRIPTION_ADMIN_MODE = "TEST_INTERNAL_ADMIN_ONLY"

export type WorkspaceSubscriptionAdminWorkspace = {
  id: string
  name: string | null
  status: string | null
}

export type WorkspacePlanAssignmentWriteInput = {
  workspaceId: string
  planKey: string
  subscriptionStatus: string
  source: string
  isProductionEligible?: boolean
  effectiveFrom?: string
  effectiveUntil?: string | null
  reason?: string | null
  actorId?: string | null
  metadata?: Record<string, unknown>
}

export type WorkspacePlanAssignmentWriteRecord = {
  workspace_id: string
  plan_key: string
  subscription_status: string
  source: string
  is_production_eligible: boolean
  effective_from: string
  effective_until: string | null
  reason: string | null
  created_by?: string | null
  updated_by?: string | null
  metadata: Record<string, unknown>
}

export type WorkspaceSubscriptionAdminRepository = {
  getWorkspace(workspaceId: string): Promise<WorkspaceSubscriptionAdminWorkspace | null>
  listWorkspacePlanAssignments(
    workspaceId: string
  ): Promise<readonly WorkspacePlanAssignmentRow[]>
  insertWorkspacePlanAssignment(
    record: WorkspacePlanAssignmentWriteRecord
  ): Promise<WorkspacePlanAssignmentRow>
  updateWorkspacePlanAssignment(
    assignmentId: string,
    record: Partial<WorkspacePlanAssignmentWriteRecord>
  ): Promise<WorkspacePlanAssignmentRow>
}

export type WorkspaceSubscriptionAdminResult<T> =
  | {
      ok: true
      mode: typeof WORKSPACE_SUBSCRIPTION_ADMIN_MODE
      data: T
    }
  | {
      ok: false
      mode: typeof WORKSPACE_SUBSCRIPTION_ADMIN_MODE
      error: {
        code: string
        message: string
      }
    }

export type WorkspaceSubscriptionSummary = {
  workspace: WorkspaceSubscriptionAdminWorkspace
  assignments: readonly WorkspacePlanAssignmentRow[]
  workspacePlan: WorkspacePlanContext
  notices: string[]
}

export type WorkspacePlanAssignmentResult = WorkspaceSubscriptionSummary & {
  assignment: WorkspacePlanAssignmentRow
  operation: "inserted" | "updated"
}

export type WorkspaceEntitlementSummaryResult = WorkspaceSubscriptionSummary & {
  entitlementSummary: ReturnType<typeof buildDashboardEntitlementSummary>
}

export async function getWorkspaceSubscriptionSummary(input: {
  repository: WorkspaceSubscriptionAdminRepository
  workspaceId?: string | null
  now?: Date
}): Promise<WorkspaceSubscriptionAdminResult<WorkspaceSubscriptionSummary>> {
  const workspaceId = normalizeWorkspaceId(input.workspaceId)

  if (!workspaceId) {
    return fail("MISSING_WORKSPACE_ID", "workspace_id is required.")
  }

  const workspace = await input.repository.getWorkspace(workspaceId)

  if (!workspace) {
    return fail("WORKSPACE_NOT_FOUND", "Workspace was not found.")
  }

  const assignments = await input.repository.listWorkspacePlanAssignments(
    workspaceId
  )
  const workspacePlan = await resolveWorkspacePlanDbAdapter({
    workspace,
    assignmentRows: assignments,
    now: input.now,
  })

  return succeed({
    workspace,
    assignments,
    workspacePlan,
    notices: testAdminNotices(),
  })
}

export async function assignWorkspacePlan(input: {
  repository: WorkspaceSubscriptionAdminRepository
  assignment: WorkspacePlanAssignmentWriteInput
  now?: Date
}): Promise<WorkspaceSubscriptionAdminResult<WorkspacePlanAssignmentResult>> {
  const workspaceId = normalizeWorkspaceId(input.assignment.workspaceId)

  if (!workspaceId) {
    return fail("MISSING_WORKSPACE_ID", "workspace_id is required.")
  }

  const validation = validateAssignmentInput(input.assignment)

  if (!validation.ok) {
    return fail(validation.code, validation.message)
  }

  const workspace = await input.repository.getWorkspace(workspaceId)

  if (!workspace) {
    return fail("WORKSPACE_NOT_FOUND", "Workspace was not found.")
  }

  const existingAssignments =
    await input.repository.listWorkspacePlanAssignments(workspaceId)
  const currentAssignments = getCurrentAssignments(
    existingAssignments,
    input.now ?? new Date()
  )

  if (currentAssignments.length > 1) {
    return fail(
      "WORKSPACE_PLAN_CONFLICT",
      "Multiple current workspace plan assignments exist. Resolve conflict before writing."
    )
  }

  const record = buildAssignmentRecord(input.assignment)
  const assignment =
    currentAssignments.length === 1 && currentAssignments[0].id
      ? await input.repository.updateWorkspacePlanAssignment(
          currentAssignments[0].id,
          {
            ...record,
            updated_by: input.assignment.actorId ?? null,
          }
        )
      : await input.repository.insertWorkspacePlanAssignment({
          ...record,
          created_by: input.assignment.actorId ?? null,
          updated_by: input.assignment.actorId ?? null,
        })

  const assignments = await input.repository.listWorkspacePlanAssignments(
    workspaceId
  )
  const workspacePlan = await resolveWorkspacePlanDbAdapter({
    workspace,
    assignmentRows: assignments,
    now: input.now,
  })

  return succeed({
    workspace,
    assignments,
    assignment,
    operation: currentAssignments.length === 1 ? "updated" : "inserted",
    workspacePlan,
    notices: testAdminNotices(),
  })
}

export async function getWorkspaceEntitlementSummary(input: {
  repository: WorkspaceSubscriptionAdminRepository
  workspaceId?: string | null
  now?: Date
}): Promise<WorkspaceSubscriptionAdminResult<WorkspaceEntitlementSummaryResult>> {
  const summary = await getWorkspaceSubscriptionSummary(input)

  if (!summary.ok) {
    return summary
  }

  const entitlementSummary = buildDashboardEntitlementSummary({
    workspacePlan: summary.data.workspacePlan,
    mode: "test",
  })

  return succeed({
    ...summary.data,
    entitlementSummary,
  })
}

function validateAssignmentInput(input: WorkspacePlanAssignmentWriteInput):
  | { ok: true }
  | { ok: false; code: string; message: string } {
  if (!isWorkspacePlanKey(input.planKey)) {
    return {
      ok: false,
      code: "INVALID_PLAN_KEY",
      message: "plan_key is not allowed.",
    }
  }

  if (!isWorkspaceSubscriptionStatus(input.subscriptionStatus)) {
    return {
      ok: false,
      code: "INVALID_SUBSCRIPTION_STATUS",
      message: "subscription_status is not allowed.",
    }
  }

  if (!isWorkspacePlanSource(input.source)) {
    return {
      ok: false,
      code: "INVALID_SOURCE",
      message: "source is not allowed.",
    }
  }

  if (input.effectiveFrom && Number.isNaN(new Date(input.effectiveFrom).getTime())) {
    return {
      ok: false,
      code: "INVALID_EFFECTIVE_FROM",
      message: "effective_from must be a valid date.",
    }
  }

  if (
    input.effectiveUntil &&
    Number.isNaN(new Date(input.effectiveUntil).getTime())
  ) {
    return {
      ok: false,
      code: "INVALID_EFFECTIVE_UNTIL",
      message: "effective_until must be a valid date.",
    }
  }

  return { ok: true }
}

function buildAssignmentRecord(
  input: WorkspacePlanAssignmentWriteInput
): WorkspacePlanAssignmentWriteRecord {
  const plan = workspacePlanRegistryByKey[input.planKey]
  const activeStatus =
    input.subscriptionStatus === "active" || input.subscriptionStatus === "trial"
  const requestedProductionEligible = Boolean(input.isProductionEligible)
  const isProductionEligible =
    requestedProductionEligible &&
    Boolean(plan?.productionEligible) &&
    activeStatus &&
    input.planKey !== "TEST_DEMO_PLAN"

  return {
    workspace_id: input.workspaceId,
    plan_key: input.planKey,
    subscription_status: input.subscriptionStatus,
    source: input.source,
    is_production_eligible: isProductionEligible,
    effective_from: input.effectiveFrom ?? new Date().toISOString(),
    effective_until: input.effectiveUntil ?? null,
    reason: input.reason ?? "TEST/internal admin workspace plan assignment",
    metadata: {
      ...(input.metadata ?? {}),
      routeMode: WORKSPACE_SUBSCRIPTION_ADMIN_MODE,
      productionActivation: false,
      billingIntegration: false,
    },
  }
}

function getCurrentAssignments(
  assignments: readonly WorkspacePlanAssignmentRow[],
  now: Date
): WorkspacePlanAssignmentRow[] {
  return assignments.filter((assignment) => {
    if (!assignment.effective_from) {
      return false
    }

    const effectiveFrom = new Date(assignment.effective_from)
    const effectiveUntil = assignment.effective_until
      ? new Date(assignment.effective_until)
      : null

    if (Number.isNaN(effectiveFrom.getTime())) {
      return false
    }

    if (effectiveUntil && Number.isNaN(effectiveUntil.getTime())) {
      return false
    }

    return (
      effectiveFrom.getTime() <= now.getTime() &&
      (!effectiveUntil || effectiveUntil.getTime() > now.getTime())
    )
  })
}

function testAdminNotices(): string[] {
  return [
    "TEST/internal/admin support only.",
    "Does not activate production entitlement enforcement.",
    "Does not integrate billing.",
    "Song/submission/evidence workflows remain TEST-only.",
  ]
}

function normalizeWorkspaceId(workspaceId?: string | null): string | null {
  const normalized = workspaceId?.trim()
  return normalized ? normalized : null
}

function succeed<T>(data: T): WorkspaceSubscriptionAdminResult<T> {
  return {
    ok: true,
    mode: WORKSPACE_SUBSCRIPTION_ADMIN_MODE,
    data,
  }
}

function fail<T = never>(
  code: string,
  message: string
): WorkspaceSubscriptionAdminResult<T> {
  return {
    ok: false,
    mode: WORKSPACE_SUBSCRIPTION_ADMIN_MODE,
    error: {
      code,
      message,
    },
  }
}
