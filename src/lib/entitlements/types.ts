export const WORKSPACE_PLAN_KEYS = [
  "TEST_DEMO_PLAN",
  "FREE_INVITED_CONTRIBUTOR_ACCESS",
  "ARTIST_STARTER",
  "ARTIST_PRO",
  "PRODUCER_STUDIO",
  "LABEL_PUBLISHER",
  "ENTERPRISE_ADMIN_COMPANY",
] as const

export type WorkspacePlanKey = (typeof WORKSPACE_PLAN_KEYS)[number]

export const ENTITLEMENT_CAPABILITY_STATUSES = [
  "allowed",
  "limited",
  "unavailable",
  "collaborator_only",
  "enterprise_only",
  "future_deferred",
  "test_only",
  "beta",
  "unknown",
] as const

export type EntitlementCapabilityStatus =
  (typeof ENTITLEMENT_CAPABILITY_STATUSES)[number]

export type EntitlementFeatureKey = string

export type EntitlementActionKey = string

export type EntitlementQuotaKey = string

export type EntitlementSubsystemKey = string

export type EntitlementRolloutState =
  | "active"
  | "beta"
  | "future_deferred"
  | "test_only"
  | "unknown"

export type EntitlementDecisionReasonCode =
  | "ENTITLEMENT_ALLOWED"
  | "PLAN_NOT_CONFIGURED"
  | "SUBSCRIPTION_NOT_ACTIVE"
  | "FEATURE_NOT_INCLUDED"
  | "QUOTA_REQUIRED"
  | "QUOTA_EXCEEDED"
  | "FEATURE_DEFERRED"
  | "TEST_ONLY"
  | "COLLABORATOR_SCOPE_REQUIRED"
  | "ENTERPRISE_REQUIRED"
  | "BETA_ACCESS_REQUIRED"
  | "ENTITLEMENT_UNKNOWN"

export type WorkspacePlanRegistryItem = {
  key: WorkspacePlanKey
  label: string
  productionEligible: boolean
  requestScopedOnly: boolean
  billingRequiredLater: boolean
}

export type PlanCapabilityStatusMap = Record<
  WorkspacePlanKey,
  EntitlementCapabilityStatus
>

export type EntitlementCapabilityRegistryItem = {
  featureKey: EntitlementFeatureKey
  subsystem: EntitlementSubsystemKey
  actionKeys: readonly EntitlementActionKey[]
  quotaKey?: EntitlementQuotaKey
  productionSensitive: boolean
  rolloutState: EntitlementRolloutState
  auditRequired: boolean
  defaultStatusByPlan: PlanCapabilityStatusMap
  notes?: string
}

export type EntitlementCapabilityLookupResult = {
  featureKey: EntitlementFeatureKey
  status: EntitlementCapabilityStatus
  capability?: EntitlementCapabilityRegistryItem
  reasonCode: EntitlementDecisionReasonCode
}
