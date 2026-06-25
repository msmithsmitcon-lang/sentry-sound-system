import {
  EntitlementActionKey,
  EntitlementCapabilityRegistryItem,
  EntitlementCapabilityStatus,
  EntitlementDecisionReasonCode,
  EntitlementFeatureKey,
  EntitlementQuotaKey,
  WorkspacePlanKey,
} from "./types"
import {
  WorkspacePlanContext,
  WorkspaceSubscriptionStatus,
} from "./workspace-plan-status"

export type EntitlementDecisionStatus =
  | "allowed"
  | "blocked"
  | "limited"
  | "upgrade_required"
  | "test_only"
  | "deferred"
  | "unknown"

export type EntitlementDecisionMode =
  | "read"
  | "mutation"
  | "dashboard"
  | "test"

export type EntitlementQuotaDecisionInput = {
  quotaKey: EntitlementQuotaKey
  used: number
  limit: number | "unlimited" | "custom"
  exceeded: boolean
}

export type CheckEntitlementInput = {
  workspacePlan?: WorkspacePlanContext | null
  featureKey: EntitlementFeatureKey
  actionKey: EntitlementActionKey
  mode: EntitlementDecisionMode
  productionSensitive?: boolean
  quota?: EntitlementQuotaDecisionInput
  capabilityRegistry?: readonly EntitlementCapabilityRegistryItem[]
}

export type EntitlementDecisionAuditMetadata = {
  workspaceId: string | null
  planKey?: WorkspacePlanKey
  subscriptionStatus?: WorkspaceSubscriptionStatus
  featureKey: EntitlementFeatureKey
  actionKey: EntitlementActionKey
  capabilityStatus: EntitlementCapabilityStatus
  decisionStatus: EntitlementDecisionStatus
  reasonCode: EntitlementDecisionReasonCode
  mode: EntitlementDecisionMode
  productionSensitive: boolean
  rolloutState?: string
  quotaKey?: EntitlementQuotaKey
}

export type EntitlementDecision = {
  allowed: boolean
  status: EntitlementDecisionStatus
  featureKey: EntitlementFeatureKey
  actionKey: EntitlementActionKey
  workspaceId: string | null
  planKey?: WorkspacePlanKey
  subscriptionStatus?: WorkspaceSubscriptionStatus
  capabilityStatus: EntitlementCapabilityStatus
  productionSensitive: boolean
  reasonCode: EntitlementDecisionReasonCode
  capability?: EntitlementCapabilityRegistryItem
  quota?: EntitlementQuotaDecisionInput
  auditMetadata: EntitlementDecisionAuditMetadata
}
