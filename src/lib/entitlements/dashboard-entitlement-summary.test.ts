import {
  EntitlementCapabilityRegistryItem,
  WorkspacePlanContext,
  buildDashboardEntitlementSummary,
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

const allowedReadOnlyCapability: EntitlementCapabilityRegistryItem = {
  featureKey: "test.dashboard.allowed_read",
  subsystem: "test",
  actionKeys: ["test.dashboard.view"],
  productionSensitive: false,
  rolloutState: "active",
  auditRequired: false,
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

const limitedSensitiveCapability: EntitlementCapabilityRegistryItem = {
  ...allowedReadOnlyCapability,
  featureKey: "test.dashboard.limited_sensitive",
  actionKeys: ["test.dashboard.mutate"],
  quotaKey: "test_quota",
  productionSensitive: true,
  defaultStatusByPlan: {
    ...allowedReadOnlyCapability.defaultStatusByPlan,
    ARTIST_PRO: "limited",
  },
}

const deferredCapability: EntitlementCapabilityRegistryItem = {
  ...allowedReadOnlyCapability,
  featureKey: "test.dashboard.deferred",
  actionKeys: ["test.dashboard.deferred_action"],
  rolloutState: "future_deferred",
}

const testOnlyCapability: EntitlementCapabilityRegistryItem = {
  ...allowedReadOnlyCapability,
  featureKey: "test.dashboard.test_only",
  actionKeys: ["test.dashboard.preview"],
  rolloutState: "test_only",
}

const capabilityRegistry = [
  allowedReadOnlyCapability,
  limitedSensitiveCapability,
  deferredCapability,
  testOnlyCapability,
]

const defaultRequests = [
  {
    featureKey: "test.dashboard.allowed_read",
    actionKey: "test.dashboard.view",
    label: "Allowed read-only",
    dashboardSection: "test",
  },
  {
    featureKey: "test.dashboard.limited_sensitive",
    actionKey: "test.dashboard.mutate",
    label: "Limited sensitive",
    dashboardSection: "test",
  },
]

const summary = buildDashboardEntitlementSummary({
  workspacePlan: activeWorkspacePlan,
  capabilities: defaultRequests,
  capabilityRegistry,
})

assert(summary.items.length === 2, "Summary must return items.")
assert(
  summary.items.every((item) => item.productionReady === false),
  "Production ready must always be false."
)

const unknownSummary = buildDashboardEntitlementSummary({
  workspacePlan: activeWorkspacePlan,
  capabilities: [
    {
      featureKey: "test.dashboard.unknown",
      actionKey: "test.dashboard.view",
      label: "Unknown",
    },
  ],
  capabilityRegistry,
})

assert(
  unknownSummary.items[0]?.displayStatus === "unknown",
  "Unknown feature must map to unknown."
)
assert(!unknownSummary.items[0]?.enabled, "Unknown feature must be disabled.")

const missingPlanSummary = buildDashboardEntitlementSummary({
  workspacePlan: resolveWorkspacePlan({
    workspace: {
      id: "workspace_without_plan",
      name: "Workspace Without Plan",
      status: "active",
    },
  }),
  capabilities: defaultRequests,
  capabilityRegistry,
})

assert(
  missingPlanSummary.items[0]?.displayStatus === "not_configured",
  "Missing plan must map to not_configured."
)

const deferredSummary = buildDashboardEntitlementSummary({
  workspacePlan: activeWorkspacePlan,
  capabilities: [
    {
      featureKey: "test.dashboard.deferred",
      actionKey: "test.dashboard.deferred_action",
      label: "Deferred",
    },
  ],
  capabilityRegistry,
})

assert(
  deferredSummary.items[0]?.displayStatus === "deferred",
  "Deferred capability must map to deferred."
)

const testOnlySummary = buildDashboardEntitlementSummary({
  workspacePlan: resolveWorkspacePlan({
    workspace: {
      id: "workspace_demo",
      name: "Sentry Sound Demo Workspace",
      status: "active",
    },
  }),
  mode: "test",
  capabilities: [
    {
      featureKey: "test.dashboard.test_only",
      actionKey: "test.dashboard.preview",
      label: "TEST-only",
    },
  ],
  capabilityRegistry,
})

assert(
  testOnlySummary.items[0]?.displayStatus === "test_only",
  "TEST-only capability must map to test_only."
)
assert(
  testOnlySummary.items[0]?.productionReady === false,
  "TEST-only capability must never be production-ready."
)

const limitedSensitive = summary.items.find(
  (item) => item.featureKey === "test.dashboard.limited_sensitive"
)

assert(
  limitedSensitive?.displayStatus === "limited",
  "Limited sensitive item without quota must map to limited."
)
assert(
  limitedSensitive.enabled === false,
  "Limited sensitive item without quota must be disabled."
)

const allowedReadOnly = summary.items.find(
  (item) => item.featureKey === "test.dashboard.allowed_read"
)

assert(
  allowedReadOnly?.visible === true,
  "Allowed read-only item must be visible."
)
assert(
  allowedReadOnly.enabled === true,
  "Allowed read-only item must be enabled."
)

assert(
  summary.auditMetadata.generatedFor === "dashboard_entitlement_summary",
  "Summary must include audit metadata."
)
assert(
  summary.auditMetadata.itemCount === summary.items.length,
  "Audit metadata must include item count."
)

assert(
  [...summary.items, ...testOnlySummary.items].every(
    (item) => item.productionReady === false
  ),
  "All dashboard summary items must keep productionReady false."
)

console.log("Dashboard entitlement summary tests passed")

