import {
  EntitlementCapabilityRegistryItem,
  EntitlementCapabilityStatus,
  EntitlementFeatureKey,
  EntitlementCapabilityLookupResult,
  WorkspacePlanKey,
} from "./types"

const productionPlans = {
  ARTIST_STARTER: "limited",
  ARTIST_PRO: "allowed",
  PRODUCER_STUDIO: "allowed",
  LABEL_PUBLISHER: "allowed",
  ENTERPRISE_ADMIN_COMPANY: "allowed",
} as const

export const entitlementCapabilityRegistry = [
  {
    featureKey: "works.capture",
    subsystem: "works",
    actionKeys: ["works.create", "works.create.production"],
    quotaKey: "active_works",
    productionSensitive: true,
    rolloutState: "test_only",
    auditRequired: true,
    defaultStatusByPlan: {
      TEST_DEMO_PLAN: "test_only",
      FREE_INVITED_CONTRIBUTOR_ACCESS: "unavailable",
      ...productionPlans,
    },
    notes:
      "Current implementation remains TEST-only until production mutation governance is added.",
  },
  {
    featureKey: "contributors.manage",
    subsystem: "contributors",
    actionKeys: ["contributors.add", "contributors.edit_splits"],
    productionSensitive: true,
    rolloutState: "test_only",
    auditRequired: true,
    defaultStatusByPlan: {
      TEST_DEMO_PLAN: "test_only",
      FREE_INVITED_CONTRIBUTOR_ACCESS: "collaborator_only",
      ...productionPlans,
    },
  },
  {
    featureKey: "submissions.readiness",
    subsystem: "submissions",
    actionKeys: ["submissions.check_readiness"],
    productionSensitive: false,
    rolloutState: "test_only",
    auditRequired: true,
    defaultStatusByPlan: {
      TEST_DEMO_PLAN: "test_only",
      FREE_INVITED_CONTRIBUTOR_ACCESS: "collaborator_only",
      ARTIST_STARTER: "limited",
      ARTIST_PRO: "allowed",
      PRODUCER_STUDIO: "allowed",
      LABEL_PUBLISHER: "allowed",
      ENTERPRISE_ADMIN_COMPANY: "allowed",
    },
  },
  {
    featureKey: "submissions.queue",
    subsystem: "submissions",
    actionKeys: ["submissions.queue_from_work"],
    quotaKey: "monthly_submission_queue_items",
    productionSensitive: true,
    rolloutState: "test_only",
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
  },
  {
    featureKey: "evidence.readiness",
    subsystem: "evidence",
    actionKeys: ["evidence.check_readiness"],
    productionSensitive: false,
    rolloutState: "test_only",
    auditRequired: true,
    defaultStatusByPlan: {
      TEST_DEMO_PLAN: "test_only",
      FREE_INVITED_CONTRIBUTOR_ACCESS: "collaborator_only",
      ...productionPlans,
    },
  },
  {
    featureKey: "evidence.upload",
    subsystem: "evidence",
    actionKeys: ["evidence.upload", "evidence.link"],
    quotaKey: "evidence_storage_mb",
    productionSensitive: true,
    rolloutState: "future_deferred",
    auditRequired: true,
    defaultStatusByPlan: {
      TEST_DEMO_PLAN: "future_deferred",
      FREE_INVITED_CONTRIBUTOR_ACCESS: "collaborator_only",
      ARTIST_STARTER: "limited",
      ARTIST_PRO: "allowed",
      PRODUCER_STUDIO: "allowed",
      LABEL_PUBLISHER: "allowed",
      ENTERPRISE_ADMIN_COMPANY: "allowed",
    },
  },
  {
    featureKey: "dashboard.summary",
    subsystem: "dashboard",
    actionKeys: ["dashboard.view"],
    productionSensitive: false,
    rolloutState: "future_deferred",
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
  },
  {
    featureKey: "finance.read",
    subsystem: "finance",
    actionKeys: ["finance.read"],
    productionSensitive: true,
    rolloutState: "future_deferred",
    auditRequired: true,
    defaultStatusByPlan: {
      TEST_DEMO_PLAN: "future_deferred",
      FREE_INVITED_CONTRIBUTOR_ACCESS: "unavailable",
      ARTIST_STARTER: "unavailable",
      ARTIST_PRO: "limited",
      PRODUCER_STUDIO: "limited",
      LABEL_PUBLISHER: "allowed",
      ENTERPRISE_ADMIN_COMPANY: "allowed",
    },
  },
  {
    featureKey: "reports.export",
    subsystem: "reports",
    actionKeys: ["reports.export"],
    quotaKey: "report_exports",
    productionSensitive: true,
    rolloutState: "future_deferred",
    auditRequired: true,
    defaultStatusByPlan: {
      TEST_DEMO_PLAN: "future_deferred",
      FREE_INVITED_CONTRIBUTOR_ACCESS: "unavailable",
      ARTIST_STARTER: "limited",
      ARTIST_PRO: "limited",
      PRODUCER_STUDIO: "limited",
      LABEL_PUBLISHER: "allowed",
      ENTERPRISE_ADMIN_COMPANY: "allowed",
    },
  },
  {
    featureKey: "workflow.automation",
    subsystem: "workflow",
    actionKeys: ["workflow.automation.run"],
    quotaKey: "automation_runs",
    productionSensitive: true,
    rolloutState: "future_deferred",
    auditRequired: true,
    defaultStatusByPlan: {
      TEST_DEMO_PLAN: "future_deferred",
      FREE_INVITED_CONTRIBUTOR_ACCESS: "unavailable",
      ARTIST_STARTER: "unavailable",
      ARTIST_PRO: "limited",
      PRODUCER_STUDIO: "limited",
      LABEL_PUBLISHER: "allowed",
      ENTERPRISE_ADMIN_COMPANY: "allowed",
    },
  },
  {
    featureKey: "ai.assistant",
    subsystem: "ai",
    actionKeys: ["ai.assistant.use"],
    productionSensitive: false,
    rolloutState: "future_deferred",
    auditRequired: true,
    defaultStatusByPlan: {
      TEST_DEMO_PLAN: "test_only",
      FREE_INVITED_CONTRIBUTOR_ACCESS: "limited",
      ARTIST_STARTER: "limited",
      ARTIST_PRO: "limited",
      PRODUCER_STUDIO: "limited",
      LABEL_PUBLISHER: "limited",
      ENTERPRISE_ADMIN_COMPANY: "allowed",
    },
  },
  {
    featureKey: "api.integrations",
    subsystem: "api",
    actionKeys: ["api.integrations.use"],
    quotaKey: "api_requests",
    productionSensitive: true,
    rolloutState: "future_deferred",
    auditRequired: true,
    defaultStatusByPlan: {
      TEST_DEMO_PLAN: "unavailable",
      FREE_INVITED_CONTRIBUTOR_ACCESS: "unavailable",
      ARTIST_STARTER: "unavailable",
      ARTIST_PRO: "future_deferred",
      PRODUCER_STUDIO: "future_deferred",
      LABEL_PUBLISHER: "limited",
      ENTERPRISE_ADMIN_COMPANY: "enterprise_only",
    },
  },
] as const satisfies readonly EntitlementCapabilityRegistryItem[]

export const entitlementCapabilityRegistryByFeatureKey = Object.fromEntries(
  entitlementCapabilityRegistry.map((capability) => [
    capability.featureKey,
    capability,
  ])
) as Record<EntitlementFeatureKey, EntitlementCapabilityRegistryItem>

export function getCapabilityStatusForPlan(
  featureKey: EntitlementFeatureKey,
  planKey: WorkspacePlanKey
): EntitlementCapabilityLookupResult {
  const capability = entitlementCapabilityRegistryByFeatureKey[featureKey]

  if (!capability) {
    return {
      featureKey,
      status: "unknown",
      reasonCode: "ENTITLEMENT_UNKNOWN",
    }
  }

  const status = capability.defaultStatusByPlan[planKey] ?? "unknown"

  return {
    featureKey,
    status,
    capability,
    reasonCode: getReasonCodeForCapabilityStatus(status),
  }
}

export function getReasonCodeForCapabilityStatus(
  status: EntitlementCapabilityStatus
): EntitlementCapabilityLookupResult["reasonCode"] {
  switch (status) {
    case "allowed":
      return "ENTITLEMENT_ALLOWED"
    case "limited":
      return "QUOTA_REQUIRED"
    case "collaborator_only":
      return "COLLABORATOR_SCOPE_REQUIRED"
    case "enterprise_only":
      return "ENTERPRISE_REQUIRED"
    case "future_deferred":
      return "FEATURE_DEFERRED"
    case "test_only":
      return "TEST_ONLY"
    case "beta":
      return "BETA_ACCESS_REQUIRED"
    case "unavailable":
      return "FEATURE_NOT_INCLUDED"
    case "unknown":
    default:
      return "ENTITLEMENT_UNKNOWN"
  }
}

export function isCapabilityStatusProductionRunnable(
  status: EntitlementCapabilityStatus
): boolean {
  return status === "allowed"
}
