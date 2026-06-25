import { entitlementCapabilityRegistry } from "./capability-registry"
import { checkEntitlement } from "./check-entitlement"
import {
  CheckEntitlementInput,
  EntitlementDecision,
  EntitlementDecisionAuditMetadata,
  EntitlementDecisionMode,
  EntitlementQuotaDecisionInput,
} from "./entitlement-decision"
import {
  EntitlementActionKey,
  EntitlementCapabilityRegistryItem,
  EntitlementDecisionReasonCode,
  EntitlementFeatureKey,
  WorkspacePlanKey,
} from "./types"
import {
  WorkspacePlanContext,
  WorkspaceSubscriptionStatus,
} from "./workspace-plan-status"

export type DashboardEntitlementDisplayStatus =
  | "available"
  | "limited"
  | "upgrade_required"
  | "permission_denied"
  | "deferred"
  | "test_only"
  | "not_configured"
  | "unavailable"
  | "unknown"

export type DashboardEntitlementRequest = {
  featureKey: EntitlementFeatureKey
  actionKey: EntitlementActionKey
  label: string
  dashboardSection?: string
  productionSensitive?: boolean
}

export type DashboardEntitlementItem = {
  featureKey: EntitlementFeatureKey
  actionKey: EntitlementActionKey
  label: string
  dashboardSection?: string
  displayStatus: DashboardEntitlementDisplayStatus
  enabled: boolean
  visible: boolean
  productionReady: false
  reasonCode: EntitlementDecisionReasonCode
  decision: EntitlementDecision
  quota?: EntitlementQuotaDecisionInput
}

export type DashboardEntitlementSummaryAuditMetadata = {
  workspaceId: string | null
  planKey?: WorkspacePlanKey
  subscriptionStatus?: WorkspaceSubscriptionStatus
  mode: EntitlementDecisionMode
  itemCount: number
  generatedFor: "dashboard_entitlement_summary"
  decisions: EntitlementDecisionAuditMetadata[]
}

export type DashboardEntitlementSummary = {
  workspaceId: string | null
  planKey?: WorkspacePlanKey
  subscriptionStatus?: WorkspaceSubscriptionStatus
  mode: EntitlementDecisionMode
  items: DashboardEntitlementItem[]
  auditMetadata: DashboardEntitlementSummaryAuditMetadata
}

export type BuildDashboardEntitlementSummaryInput = {
  workspacePlan?: WorkspacePlanContext | null
  mode?: EntitlementDecisionMode
  capabilities?: readonly DashboardEntitlementRequest[]
  quotaByKey?: Record<string, EntitlementQuotaDecisionInput | undefined>
  capabilityRegistry?: readonly EntitlementCapabilityRegistryItem[]
}

export const defaultDashboardEntitlementRequests = [
  {
    featureKey: "dashboard.summary",
    actionKey: "dashboard.view",
    label: "Dashboard summary",
    dashboardSection: "dashboard",
  },
  {
    featureKey: "works.capture",
    actionKey: "works.create",
    label: "Create work",
    dashboardSection: "registration",
  },
  {
    featureKey: "submissions.readiness",
    actionKey: "submissions.check_readiness",
    label: "Check readiness",
    dashboardSection: "submissions",
  },
  {
    featureKey: "submissions.queue",
    actionKey: "submissions.queue_from_work",
    label: "Queue submission",
    dashboardSection: "submissions",
  },
  {
    featureKey: "evidence.readiness",
    actionKey: "evidence.check_readiness",
    label: "Evidence readiness",
    dashboardSection: "evidence",
  },
  {
    featureKey: "evidence.upload",
    actionKey: "evidence.upload",
    label: "Upload evidence",
    dashboardSection: "evidence",
  },
  {
    featureKey: "finance.read",
    actionKey: "finance.read",
    label: "Finance",
    dashboardSection: "finance",
  },
] as const satisfies readonly DashboardEntitlementRequest[]

export function buildDashboardEntitlementSummary(
  input: BuildDashboardEntitlementSummaryInput
): DashboardEntitlementSummary {
  const mode = input.mode ?? "dashboard"
  const requests = input.capabilities ?? defaultDashboardEntitlementRequests
  const registry = input.capabilityRegistry ?? entitlementCapabilityRegistry

  const items = requests.map((request) =>
    buildDashboardEntitlementItem({
      request,
      workspacePlan: input.workspacePlan,
      mode,
      quotaByKey: input.quotaByKey,
      capabilityRegistry: registry,
    })
  )

  return {
    workspaceId: input.workspacePlan?.workspaceId ?? null,
    planKey: input.workspacePlan?.planKey,
    subscriptionStatus: input.workspacePlan?.subscriptionStatus,
    mode,
    items,
    auditMetadata: {
      workspaceId: input.workspacePlan?.workspaceId ?? null,
      planKey: input.workspacePlan?.planKey,
      subscriptionStatus: input.workspacePlan?.subscriptionStatus,
      mode,
      itemCount: items.length,
      generatedFor: "dashboard_entitlement_summary",
      decisions: items.map((item) => item.decision.auditMetadata),
    },
  }
}

export function mapDecisionToDashboardDisplayStatus(
  decision: EntitlementDecision
): DashboardEntitlementDisplayStatus {
  if (decision.reasonCode === "PLAN_NOT_CONFIGURED") {
    return "not_configured"
  }

  if (decision.reasonCode === "COLLABORATOR_SCOPE_REQUIRED") {
    return "permission_denied"
  }

  if (decision.reasonCode === "FEATURE_NOT_INCLUDED") {
    return "upgrade_required"
  }

  if (decision.status === "allowed") {
    return "available"
  }

  if (decision.status === "limited") {
    return "limited"
  }

  if (decision.status === "upgrade_required") {
    return "upgrade_required"
  }

  if (decision.status === "deferred") {
    return "deferred"
  }

  if (decision.status === "test_only") {
    return "test_only"
  }

  if (decision.status === "unknown") {
    return "unknown"
  }

  if (decision.reasonCode === "SUBSCRIPTION_NOT_ACTIVE") {
    return "unavailable"
  }

  return "unavailable"
}

function buildDashboardEntitlementItem(input: {
  request: DashboardEntitlementRequest
  workspacePlan?: WorkspacePlanContext | null
  mode: EntitlementDecisionMode
  quotaByKey?: Record<string, EntitlementQuotaDecisionInput | undefined>
  capabilityRegistry: readonly EntitlementCapabilityRegistryItem[]
}): DashboardEntitlementItem {
  const capability = input.capabilityRegistry.find(
    (entry) => entry.featureKey === input.request.featureKey
  )
  const quota = capability?.quotaKey
    ? input.quotaByKey?.[capability.quotaKey]
    : undefined

  const decision = checkEntitlement({
    workspacePlan: input.workspacePlan,
    featureKey: input.request.featureKey,
    actionKey: input.request.actionKey,
    mode: input.mode,
    productionSensitive: input.request.productionSensitive,
    quota,
    capabilityRegistry: input.capabilityRegistry,
  } satisfies CheckEntitlementInput)

  const displayStatus = mapDecisionToDashboardDisplayStatus(decision)

  return {
    featureKey: input.request.featureKey,
    actionKey: input.request.actionKey,
    label: input.request.label,
    dashboardSection: input.request.dashboardSection,
    displayStatus,
    enabled: isDashboardEntitlementItemEnabled(decision, displayStatus),
    visible: true,
    productionReady: false,
    reasonCode: decision.reasonCode,
    decision,
    quota,
  }
}

function isDashboardEntitlementItemEnabled(
  decision: EntitlementDecision,
  displayStatus: DashboardEntitlementDisplayStatus
): boolean {
  if (!decision.allowed) {
    return false
  }

  if (decision.productionSensitive) {
    return false
  }

  return displayStatus === "available" || displayStatus === "limited"
}

