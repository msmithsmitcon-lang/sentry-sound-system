import { WorkspacePlanKey } from "./types"

export const WORKSPACE_SUBSCRIPTION_STATUSES = [
  "test_demo",
  "active",
  "trial",
  "suspended",
  "cancelled",
  "not_configured",
  "unknown",
] as const

export type WorkspaceSubscriptionStatus =
  (typeof WORKSPACE_SUBSCRIPTION_STATUSES)[number]

export const WORKSPACE_PLAN_SOURCES = [
  "system_default",
  "demo_workspace_fallback",
  "workspace_record_later",
  "admin_override_later",
  "billing_provider_later",
  "not_configured",
  "unknown",
] as const

export type WorkspacePlanSource = (typeof WORKSPACE_PLAN_SOURCES)[number]

export type WorkspacePlanReasonCode =
  | "TEST_DEMO_WORKSPACE"
  | "WORKSPACE_PLAN_ACTIVE"
  | "WORKSPACE_PLAN_NOT_CONFIGURED"
  | "WORKSPACE_PLAN_EXPIRED"
  | "WORKSPACE_PLAN_FUTURE_DATED"
  | "WORKSPACE_PLAN_CONFLICT"
  | "WORKSPACE_PLAN_MALFORMED"
  | "WORKSPACE_SUSPENDED"
  | "WORKSPACE_INACTIVE"
  | "WORKSPACE_PLAN_UNKNOWN"

export type WorkspacePlanContext = {
  workspaceId: string | null
  workspaceName?: string | null
  workspaceStatus?: string | null
  planKey?: WorkspacePlanKey
  subscriptionStatus: WorkspaceSubscriptionStatus
  source: WorkspacePlanSource
  isProductionEligible: boolean
  reasonCode: WorkspacePlanReasonCode
}

export const DEMO_WORKSPACE_NAME = "Sentry Sound Demo Workspace"
