import { workspacePlanRegistryByKey } from "./plan-registry"
import {
  isValidWorkspacePlanAssignmentRow,
  toValidDate,
  WorkspacePlanAssignmentRow,
} from "./workspace-plan-assignment-row"
import {
  DEMO_WORKSPACE_NAME,
  WorkspacePlanContext,
  WorkspacePlanReasonCode,
} from "./workspace-plan-status"

export type ResolveWorkspacePlanFromAssignmentInput = {
  workspace?: {
    id?: string | null
    name?: string | null
    status?: string | null
  } | null
  assignmentRows?: readonly WorkspacePlanAssignmentRow[] | null
  now?: Date
}

export function resolveWorkspacePlanFromAssignment(
  input: ResolveWorkspacePlanFromAssignmentInput
): WorkspacePlanContext {
  const workspace = input.workspace
  const workspaceId = workspace?.id ?? null
  const workspaceName = workspace?.name ?? null
  const workspaceStatus = workspace?.status ?? null
  const now = input.now ?? new Date()

  if (!workspace || !workspaceId) {
    return failClosed({
      workspaceId,
      workspaceName,
      workspaceStatus,
      reasonCode: "WORKSPACE_PLAN_UNKNOWN",
      subscriptionStatus: "unknown",
      source: "unknown",
    })
  }

  if (workspaceStatus === "suspended") {
    return failClosed({
      workspaceId,
      workspaceName,
      workspaceStatus,
      reasonCode: "WORKSPACE_SUSPENDED",
      subscriptionStatus: "suspended",
      source: "not_configured",
    })
  }

  if (workspaceStatus === "inactive") {
    return failClosed({
      workspaceId,
      workspaceName,
      workspaceStatus,
      reasonCode: "WORKSPACE_INACTIVE",
      subscriptionStatus: "not_configured",
      source: "not_configured",
    })
  }

  if (workspaceName === DEMO_WORKSPACE_NAME) {
    return {
      workspaceId,
      workspaceName,
      workspaceStatus,
      planKey: "TEST_DEMO_PLAN",
      subscriptionStatus: "test_demo",
      source: "demo_workspace_fallback",
      isProductionEligible: false,
      reasonCode: "TEST_DEMO_WORKSPACE",
    }
  }

  const assignmentRows = input.assignmentRows ?? []

  if (assignmentRows.length === 0) {
    return failClosed({
      workspaceId,
      workspaceName,
      workspaceStatus,
      reasonCode: "WORKSPACE_PLAN_NOT_CONFIGURED",
      subscriptionStatus: "not_configured",
      source: "not_configured",
    })
  }

  const workspaceRows = assignmentRows.filter(
    (row) => row.workspace_id === workspaceId
  )

  if (workspaceRows.length === 0) {
    return failClosed({
      workspaceId,
      workspaceName,
      workspaceStatus,
      reasonCode: "WORKSPACE_PLAN_NOT_CONFIGURED",
      subscriptionStatus: "not_configured",
      source: "not_configured",
    })
  }

  if (
    workspaceRows.some(
      (row) => !isValidWorkspacePlanAssignmentRow(row, workspaceId)
    )
  ) {
    return failClosed({
      workspaceId,
      workspaceName,
      workspaceStatus,
      reasonCode: "WORKSPACE_PLAN_MALFORMED",
      subscriptionStatus: "unknown",
      source: "unknown",
    })
  }

  const currentRows = workspaceRows.filter((row) =>
    isCurrentAssignment(row, now)
  )

  if (currentRows.length > 1) {
    return failClosed({
      workspaceId,
      workspaceName,
      workspaceStatus,
      reasonCode: "WORKSPACE_PLAN_CONFLICT",
      subscriptionStatus: "unknown",
      source: "unknown",
    })
  }

  if (currentRows.length === 0) {
    const hasFutureRow = workspaceRows.some((row) => {
      const effectiveFrom = toValidDate(row.effective_from as string | Date)
      return effectiveFrom ? effectiveFrom.getTime() > now.getTime() : false
    })

    return failClosed({
      workspaceId,
      workspaceName,
      workspaceStatus,
      reasonCode: hasFutureRow
        ? "WORKSPACE_PLAN_FUTURE_DATED"
        : "WORKSPACE_PLAN_EXPIRED",
      subscriptionStatus: "not_configured",
      source: "not_configured",
    })
  }

  const assignment = currentRows[0]
  const plan = workspacePlanRegistryByKey[assignment.plan_key]
  const activeStatus =
    assignment.subscription_status === "active" ||
    assignment.subscription_status === "trial"
  const isProductionEligible =
    Boolean(plan?.productionEligible) &&
    activeStatus &&
    assignment.is_production_eligible

  return {
    workspaceId,
    workspaceName,
    workspaceStatus,
    planKey: assignment.plan_key,
    subscriptionStatus: assignment.subscription_status,
    source: assignment.source,
    isProductionEligible,
    reasonCode: activeStatus
      ? "WORKSPACE_PLAN_ACTIVE"
      : "WORKSPACE_PLAN_MALFORMED",
  }
}

function isCurrentAssignment(
  row: WorkspacePlanAssignmentRow,
  now: Date
): boolean {
  const effectiveFrom = toValidDate(row.effective_from as string | Date)
  const effectiveUntil = row.effective_until
    ? toValidDate(row.effective_until)
    : null

  if (!effectiveFrom) {
    return false
  }

  return (
    effectiveFrom.getTime() <= now.getTime() &&
    (!effectiveUntil || effectiveUntil.getTime() > now.getTime())
  )
}

function failClosed(input: {
  workspaceId: string | null
  workspaceName?: string | null
  workspaceStatus?: string | null
  reasonCode: WorkspacePlanReasonCode
  subscriptionStatus: WorkspacePlanContext["subscriptionStatus"]
  source: WorkspacePlanContext["source"]
}): WorkspacePlanContext {
  return {
    workspaceId: input.workspaceId,
    workspaceName: input.workspaceName,
    workspaceStatus: input.workspaceStatus,
    subscriptionStatus: input.subscriptionStatus,
    source: input.source,
    isProductionEligible: false,
    reasonCode: input.reasonCode,
  }
}
