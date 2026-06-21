import {
  ENTITLEMENT_CAPABILITY_STATUSES,
  WORKSPACE_PLAN_KEYS,
  EntitlementCapabilityRegistryItem,
  entitlementCapabilityRegistry,
  getCapabilityStatusForPlan,
  isCapabilityStatusProductionRunnable,
  workspacePlanRegistry,
} from "./index"

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

const expectedPlanKeys = [
  "TEST_DEMO_PLAN",
  "FREE_INVITED_CONTRIBUTOR_ACCESS",
  "ARTIST_STARTER",
  "ARTIST_PRO",
  "PRODUCER_STUDIO",
  "LABEL_PUBLISHER",
  "ENTERPRISE_ADMIN_COMPANY",
]

assert(
  JSON.stringify(WORKSPACE_PLAN_KEYS) === JSON.stringify(expectedPlanKeys),
  "Workspace plan keys must match the canonical seven plan keys exactly."
)

assert(
  workspacePlanRegistry.length === expectedPlanKeys.length,
  "Workspace plan registry must contain all canonical plan keys."
)

const expectedStatuses = [
  "allowed",
  "limited",
  "unavailable",
  "collaborator_only",
  "enterprise_only",
  "future_deferred",
  "test_only",
  "beta",
  "unknown",
]

assert(
  JSON.stringify(ENTITLEMENT_CAPABILITY_STATUSES) ===
    JSON.stringify(expectedStatuses),
  "Capability statuses must match the canonical status list exactly."
)

assert(
  entitlementCapabilityRegistry.length > 0,
  "Capability registry must contain at least one feature."
)

const featureKeys = new Set<string>()

for (const capability of entitlementCapabilityRegistry) {
  assert(
    !featureKeys.has(capability.featureKey),
    `Duplicate feature key found: ${capability.featureKey}`
  )

  featureKeys.add(capability.featureKey)

  assert(
    capability.subsystem.length > 0,
    `Capability ${capability.featureKey} must declare a subsystem.`
  )

  assert(
    capability.actionKeys.length > 0,
    `Capability ${capability.featureKey} must declare at least one action key.`
  )

  for (const planKey of WORKSPACE_PLAN_KEYS) {
    assert(
      capability.defaultStatusByPlan[planKey] !== undefined,
      `Capability ${capability.featureKey} must define a status for ${planKey}.`
    )
  }
}

const unknown = getCapabilityStatusForPlan(
  "future.unregistered_feature",
  "ARTIST_PRO"
)

assert(
  unknown.status === "unknown",
  "Unknown feature keys must resolve to unknown."
)

assert(
  unknown.reasonCode === "ENTITLEMENT_UNKNOWN",
  "Unknown feature keys must fail closed with ENTITLEMENT_UNKNOWN."
)

assert(
  !isCapabilityStatusProductionRunnable(unknown.status),
  "Unknown feature keys must not be production runnable."
)

assert(
  !isCapabilityStatusProductionRunnable("future_deferred"),
  "Future deferred features must not be production runnable."
)

assert(
  !isCapabilityStatusProductionRunnable("test_only"),
  "TEST-only features must not be production runnable."
)

assert(
  !isCapabilityStatusProductionRunnable("limited"),
  "Limited features must not be treated as production runnable without later quota evaluation."
)

const futureSubsystemExample: EntitlementCapabilityRegistryItem = {
  featureKey: "future.subsystem_feature",
  subsystem: "future-subsystem",
  actionKeys: ["future.action"],
  productionSensitive: true,
  rolloutState: "future_deferred",
  auditRequired: true,
  defaultStatusByPlan: {
    TEST_DEMO_PLAN: "future_deferred",
    FREE_INVITED_CONTRIBUTOR_ACCESS: "unavailable",
    ARTIST_STARTER: "unavailable",
    ARTIST_PRO: "future_deferred",
    PRODUCER_STUDIO: "future_deferred",
    LABEL_PUBLISHER: "future_deferred",
    ENTERPRISE_ADMIN_COMPANY: "enterprise_only",
  },
}

assert(
  futureSubsystemExample.subsystem === "future-subsystem",
  "Registry item shape must support future subsystem namespaces."
)

console.log("Entitlement registry contract tests passed")
