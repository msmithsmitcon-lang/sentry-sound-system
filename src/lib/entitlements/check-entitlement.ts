import { entitlementCapabilityRegistry } from "./capability-registry"
import {
  CheckEntitlementInput,
  EntitlementDecision,
  EntitlementDecisionStatus,
} from "./entitlement-decision"
import {
  EntitlementCapabilityRegistryItem,
  EntitlementCapabilityStatus,
  EntitlementDecisionReasonCode,
} from "./types"

export function checkEntitlement(
  input: CheckEntitlementInput
): EntitlementDecision {
  const registry = input.capabilityRegistry ?? entitlementCapabilityRegistry
  const capability = registry.find(
    (entry) => entry.featureKey === input.featureKey
  )

  if (!capability) {
    return buildDecision(input, {
      allowed: false,
      status: "unknown",
      capabilityStatus: "unknown",
      reasonCode: "ENTITLEMENT_UNKNOWN",
    })
  }

  const productionSensitive =
    input.productionSensitive ?? capability.productionSensitive

  if (!capability.actionKeys.includes(input.actionKey)) {
    return buildDecision(input, {
      allowed: false,
      status: "unknown",
      capability,
      capabilityStatus: "unknown",
      productionSensitive,
      reasonCode: "ENTITLEMENT_UNKNOWN",
    })
  }

  const workspacePlan = input.workspacePlan

  if (!workspacePlan?.workspaceId) {
    return buildDecision(input, {
      allowed: false,
      status: "unknown",
      capability,
      capabilityStatus: "unknown",
      productionSensitive,
      reasonCode: "PLAN_NOT_CONFIGURED",
    })
  }

  if (
    workspacePlan.subscriptionStatus === "suspended" ||
    workspacePlan.subscriptionStatus === "cancelled" ||
    workspacePlan.subscriptionStatus === "unknown"
  ) {
    return buildDecision(input, {
      allowed: false,
      status: "blocked",
      capability,
      capabilityStatus: "unknown",
      productionSensitive,
      reasonCode: "SUBSCRIPTION_NOT_ACTIVE",
    })
  }

  if (!workspacePlan.planKey) {
    return buildDecision(input, {
      allowed: false,
      status: "blocked",
      capability,
      capabilityStatus: "unknown",
      productionSensitive,
      reasonCode: "PLAN_NOT_CONFIGURED",
    })
  }

  const capabilityStatus =
    capability.defaultStatusByPlan[workspacePlan.planKey] ?? "unknown"

  if (capability.rolloutState === "future_deferred") {
    return buildDecision(input, {
      allowed: false,
      status: "deferred",
      capability,
      capabilityStatus,
      productionSensitive,
      reasonCode: "FEATURE_DEFERRED",
    })
  }

  if (capability.rolloutState === "test_only" && input.mode !== "test") {
    return buildDecision(input, {
      allowed: false,
      status: "test_only",
      capability,
      capabilityStatus,
      productionSensitive,
      reasonCode: "TEST_ONLY",
    })
  }

  if (productionSensitive && !workspacePlan.isProductionEligible) {
    return buildDecision(input, {
      allowed: false,
      status: capabilityStatus === "test_only" ? "test_only" : "blocked",
      capability,
      capabilityStatus,
      productionSensitive,
      reasonCode:
        capabilityStatus === "test_only" ? "TEST_ONLY" : "PLAN_NOT_CONFIGURED",
    })
  }

  if (capabilityStatus === "unknown") {
    return buildDecision(input, {
      allowed: false,
      status: "unknown",
      capability,
      capabilityStatus,
      productionSensitive,
      reasonCode: "ENTITLEMENT_UNKNOWN",
    })
  }

  if (capabilityStatus === "unavailable") {
    return buildDecision(input, {
      allowed: false,
      status: "upgrade_required",
      capability,
      capabilityStatus,
      productionSensitive,
      reasonCode: "FEATURE_NOT_INCLUDED",
    })
  }

  if (capabilityStatus === "enterprise_only") {
    return buildDecision(input, {
      allowed: false,
      status: "upgrade_required",
      capability,
      capabilityStatus,
      productionSensitive,
      reasonCode: "ENTERPRISE_REQUIRED",
    })
  }

  if (capabilityStatus === "beta") {
    return buildDecision(input, {
      allowed: false,
      status: "blocked",
      capability,
      capabilityStatus,
      productionSensitive,
      reasonCode: "BETA_ACCESS_REQUIRED",
    })
  }

  if (capabilityStatus === "collaborator_only") {
    return buildDecision(input, {
      allowed: false,
      status: "blocked",
      capability,
      capabilityStatus,
      productionSensitive,
      reasonCode: "COLLABORATOR_SCOPE_REQUIRED",
    })
  }

  if (capabilityStatus === "future_deferred") {
    return buildDecision(input, {
      allowed: false,
      status: "deferred",
      capability,
      capabilityStatus,
      productionSensitive,
      reasonCode: "FEATURE_DEFERRED",
    })
  }

  if (capabilityStatus === "test_only") {
    const allowed = input.mode === "test"

    return buildDecision(input, {
      allowed,
      status: "test_only",
      capability,
      capabilityStatus,
      productionSensitive,
      reasonCode: "TEST_ONLY",
    })
  }

  if (capabilityStatus === "limited") {
    if (input.quota?.exceeded) {
      return buildDecision(input, {
        allowed: false,
        status: "limited",
        capability,
        capabilityStatus,
        productionSensitive,
        reasonCode: "QUOTA_EXCEEDED",
      })
    }

    if (!input.quota && productionSensitive) {
      return buildDecision(input, {
        allowed: false,
        status: "limited",
        capability,
        capabilityStatus,
        productionSensitive,
        reasonCode: "QUOTA_REQUIRED",
      })
    }

    return buildDecision(input, {
      allowed: true,
      status: "limited",
      capability,
      capabilityStatus,
      productionSensitive,
      reasonCode: "ENTITLEMENT_ALLOWED",
    })
  }

  return buildDecision(input, {
    allowed: true,
    status: "allowed",
    capability,
    capabilityStatus,
    productionSensitive,
    reasonCode: "ENTITLEMENT_ALLOWED",
  })
}

function buildDecision(
  input: CheckEntitlementInput,
  result: {
    allowed: boolean
    status: EntitlementDecisionStatus
    capability?: EntitlementCapabilityRegistryItem
    capabilityStatus: EntitlementCapabilityStatus
    productionSensitive?: boolean
    reasonCode: EntitlementDecisionReasonCode
  }
): EntitlementDecision {
  const productionSensitive =
    result.productionSensitive ?? input.productionSensitive ?? false

  const workspacePlan = input.workspacePlan ?? null

  return {
    allowed: result.allowed,
    status: result.status,
    featureKey: input.featureKey,
    actionKey: input.actionKey,
    workspaceId: workspacePlan?.workspaceId ?? null,
    planKey: workspacePlan?.planKey,
    subscriptionStatus: workspacePlan?.subscriptionStatus,
    capabilityStatus: result.capabilityStatus,
    productionSensitive,
    reasonCode: result.reasonCode,
    capability: result.capability,
    quota: input.quota,
    auditMetadata: {
      workspaceId: workspacePlan?.workspaceId ?? null,
      planKey: workspacePlan?.planKey,
      subscriptionStatus: workspacePlan?.subscriptionStatus,
      featureKey: input.featureKey,
      actionKey: input.actionKey,
      capabilityStatus: result.capabilityStatus,
      decisionStatus: result.status,
      reasonCode: result.reasonCode,
      mode: input.mode,
      productionSensitive,
      rolloutState: result.capability?.rolloutState,
      quotaKey: input.quota?.quotaKey ?? result.capability?.quotaKey,
    },
  }
}
