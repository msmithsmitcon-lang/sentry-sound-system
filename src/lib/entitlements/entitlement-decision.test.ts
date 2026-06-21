import {
  CheckEntitlementInput,
  EntitlementCapabilityRegistryItem,
  WorkspacePlanContext,
  checkEntitlement,
  resolveWorkspacePlan,
} from "./index"

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

const activeWorkspacePlan: WorkspacePlanContext = {
  workspaceId: "workspace_active",
  workspaceName: "Active Workspace",
  workspaceStatus: "active",
  planKey: "ARTIST_PRO",
  subscriptionStatus: "active",
  source: "workspace_record_later",
  isProductionEligible: true,
  reasonCode: "WORKSPACE_PLAN_NOT_CONFIGURED",
}

const activeCapability: EntitlementCapabilityRegistryItem = {
  featureKey: "test.active_feature",
  subsystem: "test",
  actionKeys: ["test.active_action"],
  productionSensitive: true,
  rolloutState: "active",
  auditRequired: true,
  defaultStatusByPlan: {
    TEST_DEMO_PLAN: "test_only",
    FREE_INVITED_CONTRIBUTOR_ACCESS: "unavailable",
    ARTIST_STARTER: "limited",
    ARTIST_PRO: "allowed",
    PRODUCER_STUDIO: "allowed",
    LABEL_PUBLISHER: "allowed",
    ENTERPRISE_ADMIN_COMPANY: "allowed",
  },
}

const limitedCapability: EntitlementCapabilityRegistryItem = {
  ...activeCapability,
  featureKey: "test.limited_feature",
  actionKeys: ["test.limited_action"],
  defaultStatusByPlan: {
    ...activeCapability.defaultStatusByPlan,
    ARTIST_PRO: "limited",
  },
}

const testOnlyCapability: EntitlementCapabilityRegistryItem = {
  ...activeCapability,
  featureKey: "test.test_only_feature",
  actionKeys: ["test.test_only_action"],
  rolloutState: "test_only",
}

const futureDeferredCapability: EntitlementCapabilityRegistryItem = {
  ...activeCapability,
  featureKey: "test.future_deferred_feature",
  actionKeys: ["test.future_deferred_action"],
  rolloutState: "future_deferred",
}

function decide(input: Partial<CheckEntitlementInput>) {
  return checkEntitlement({
    workspacePlan: activeWorkspacePlan,
    featureKey: "test.active_feature",
    actionKey: "test.active_action",
    mode: "mutation",
    capabilityRegistry: [
      activeCapability,
      limitedCapability,
      testOnlyCapability,
      futureDeferredCapability,
    ],
    ...input,
  })
}

const unknownFeature = decide({
  featureKey: "test.unknown_feature",
  actionKey: "test.active_action",
})

assert(!unknownFeature.allowed, "Unknown feature must be blocked.")
assert(
  unknownFeature.status === "unknown",
  "Unknown feature must return unknown status."
)
assert(
  unknownFeature.reasonCode === "ENTITLEMENT_UNKNOWN",
  "Unknown feature must use ENTITLEMENT_UNKNOWN."
)

const unknownAction = decide({
  actionKey: "test.unknown_action",
})

assert(!unknownAction.allowed, "Unknown action must be blocked.")
assert(
  unknownAction.reasonCode === "ENTITLEMENT_UNKNOWN",
  "Unknown action must fail closed with ENTITLEMENT_UNKNOWN."
)

const demoWorkspace = resolveWorkspacePlan({
  workspace: {
    id: "workspace_demo",
    name: "Sentry Sound Demo Workspace",
    status: "active",
  },
})

const demoDecision = decide({
  workspacePlan: demoWorkspace,
  featureKey: "test.test_only_feature",
  actionKey: "test.test_only_action",
  mode: "mutation",
})

assert(!demoDecision.allowed, "Demo workspace must not allow production mutation.")
assert(
  demoDecision.reasonCode === "TEST_ONLY",
  "Demo production mutation must return TEST_ONLY."
)

const suspendedDecision = decide({
  workspacePlan: {
    ...activeWorkspacePlan,
    subscriptionStatus: "suspended",
    isProductionEligible: false,
    reasonCode: "WORKSPACE_SUSPENDED",
  },
})

assert(!suspendedDecision.allowed, "Suspended workspace must be blocked.")
assert(
  suspendedDecision.reasonCode === "SUBSCRIPTION_NOT_ACTIVE",
  "Suspended workspace must use SUBSCRIPTION_NOT_ACTIVE."
)

const inactiveDecision = decide({
  workspacePlan: resolveWorkspacePlan({
    workspace: {
      id: "workspace_inactive",
      name: "Inactive Workspace",
      status: "inactive",
    },
  }),
})

assert(!inactiveDecision.allowed, "Inactive workspace must be blocked.")
assert(
  inactiveDecision.reasonCode === "PLAN_NOT_CONFIGURED",
  "Inactive workspace without plan must use PLAN_NOT_CONFIGURED."
)

const missingPlanDecision = decide({
  workspacePlan: resolveWorkspacePlan({
    workspace: {
      id: "workspace_without_plan",
      name: "Workspace Without Plan",
      status: "active",
    },
  }),
})

assert(!missingPlanDecision.allowed, "Missing plan must be blocked.")
assert(
  missingPlanDecision.reasonCode === "PLAN_NOT_CONFIGURED",
  "Missing plan must use PLAN_NOT_CONFIGURED."
)

const testOnlyDecision = decide({
  featureKey: "test.test_only_feature",
  actionKey: "test.test_only_action",
})

assert(!testOnlyDecision.allowed, "TEST-only feature must block mutation mode.")
assert(
  testOnlyDecision.status === "test_only",
  "TEST-only feature must return test_only status."
)

const futureDeferredDecision = decide({
  featureKey: "test.future_deferred_feature",
  actionKey: "test.future_deferred_action",
})

assert(!futureDeferredDecision.allowed, "Deferred feature must be blocked.")
assert(
  futureDeferredDecision.status === "deferred",
  "Deferred feature must return deferred status."
)

const limitedWithoutQuota = decide({
  featureKey: "test.limited_feature",
  actionKey: "test.limited_action",
})

assert(!limitedWithoutQuota.allowed, "Limited mutation without quota must block.")
assert(
  limitedWithoutQuota.reasonCode === "QUOTA_REQUIRED",
  "Limited mutation without quota must require quota."
)

const allowedDecision = decide({})

assert(allowedDecision.allowed, "Allowed happy path must allow.")
assert(
  allowedDecision.status === "allowed",
  "Allowed happy path must return allowed status."
)
assert(
  allowedDecision.reasonCode === "ENTITLEMENT_ALLOWED",
  "Allowed happy path must return ENTITLEMENT_ALLOWED."
)

assert(
  allowedDecision.auditMetadata.workspaceId === "workspace_active",
  "Decision must include audit metadata workspace id."
)
assert(
  allowedDecision.auditMetadata.featureKey === "test.active_feature",
  "Decision must include audit metadata feature key."
)

console.log("Entitlement decision service tests passed")
