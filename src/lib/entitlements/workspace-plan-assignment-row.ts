import { isWorkspacePlanKey } from "./plan-registry"
import { WorkspacePlanKey } from "./types"
import {
  WORKSPACE_PLAN_SOURCES,
  WORKSPACE_SUBSCRIPTION_STATUSES,
  WorkspacePlanSource,
  WorkspaceSubscriptionStatus,
} from "./workspace-plan-status"

export type WorkspacePlanAssignmentRow = {
  id?: string | null
  workspace_id?: string | null
  plan_key?: string | null
  subscription_status?: string | null
  source?: string | null
  is_production_eligible?: boolean | null
  effective_from?: string | Date | null
  effective_until?: string | Date | null
  reason?: string | null
  created_by?: string | null
  updated_by?: string | null
  metadata?: Record<string, unknown> | null
  created_at?: string | Date | null
  updated_at?: string | Date | null
}

export type ValidWorkspacePlanAssignmentRow = WorkspacePlanAssignmentRow & {
  workspace_id: string
  plan_key: WorkspacePlanKey
  subscription_status: WorkspaceSubscriptionStatus
  source: WorkspacePlanSource
  is_production_eligible: boolean
  effective_from: string | Date
}

export function isWorkspaceSubscriptionStatus(
  value: string
): value is WorkspaceSubscriptionStatus {
  return WORKSPACE_SUBSCRIPTION_STATUSES.includes(
    value as WorkspaceSubscriptionStatus
  )
}

export function isWorkspacePlanSource(
  value: string
): value is WorkspacePlanSource {
  return WORKSPACE_PLAN_SOURCES.includes(value as WorkspacePlanSource)
}

export function isValidWorkspacePlanAssignmentRow(
  row: WorkspacePlanAssignmentRow,
  workspaceId: string
): row is ValidWorkspacePlanAssignmentRow {
  if (row.workspace_id !== workspaceId) {
    return false
  }

  if (!row.plan_key || !isWorkspacePlanKey(row.plan_key)) {
    return false
  }

  if (
    !row.subscription_status ||
    !isWorkspaceSubscriptionStatus(row.subscription_status)
  ) {
    return false
  }

  if (!row.source || !isWorkspacePlanSource(row.source)) {
    return false
  }

  if (typeof row.is_production_eligible !== "boolean") {
    return false
  }

  if (!row.effective_from || !toValidDate(row.effective_from)) {
    return false
  }

  if (row.effective_until && !toValidDate(row.effective_until)) {
    return false
  }

  return true
}

export function toValidDate(value: string | Date): Date | null {
  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}
