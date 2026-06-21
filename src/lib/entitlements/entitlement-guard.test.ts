import {
  EntitlementCapabilityRegistryItem,
  WorkspacePlanContext,
  resolveWorkspacePlan,
  withEntitlementGuard,
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

const demoWorkspacePlan = resolveWorkspacePlan({
  workspace: {
    id: "workspace_demo",
    name: "Sentry Sound Demo Workspace",
    status: "active",
  },
})

const activeCapability: EntitlementCapabilityRegistryItem = {
  featureKey: "test.guard.active",
  subsystem: "test",
  actionKeys: ["test.guard.run"],
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

const testOnlyCapability: EntitlementCapabilityRegistryItem = {
  ...activeCapability,
  featureKey: "test.guard.test_only",
  actionKeys: ["test.guard.preview"],
  productionSensitive: false,
  rolloutState: "test_only",
}

const unavailableCapability: EntitlementCapabilityRegistryItem = {
  ...activeCapability,
  featureKey: "test.guard.unavailable",
  actionKeys: ["test.guard.block"],
  defaultStatusByPlan: {
    ...activeCapability.defaultStatusByPlan,
    ARTIST_PRO: "unavailable",
  },
}

const capabilityRegistry = [
  activeCapability,
  testOnlyCapability,
  unavailableCapability,
]

async function runTests() {
  let handlerCalls = 0

  const allowed = await withEntitlementGuard({
    context: {
      actorId: "actor_1",
      workspaceId: "workspace_active",
      workspacePlan: activeWorkspacePlan,
      rbac: {
        checked: true,
        allowed: true,
        resource: "works",
        action: "create",
      },
    },
    config: {
      featureKey: "test.guard.active",
      actionKey: "test.guard.run",
      mode: "mutation",
      productionSensitive: true,
      requireRbacAllowed: true,
      capabilityRegistry,
    },
    handler: () => {
      handlerCalls += 1
      return { created: true }
    },
  })

  assert(allowed.ok, "Handler must execute when entitlement is allowed.")
  assert(allowed.handlerExecuted, "Allowed guard must mark handler executed.")
  assert(handlerCalls === 1, "Allowed guard must call handler once.")
  assert(
    allowed.result?.created === true,
    "Allowed guard must return handler result."
  )

  const denied = await withEntitlementGuard({
    context: {
      workspacePlan: activeWorkspacePlan,
    },
    config: {
      featureKey: "test.guard.unavailable",
      actionKey: "test.guard.block",
      mode: "mutation",
      productionSensitive: true,
      capabilityRegistry,
    },
    handler: () => {
      handlerCalls += 1
      return { created: true }
    },
  })

  assert(!denied.ok, "Entitlement denied guard must block.")
  assert(
    denied.error?.code === "ENTITLEMENT_DENIED",
    "Entitlement denied guard must return ENTITLEMENT_DENIED."
  )
  assert(!denied.handlerExecuted, "Denied guard must not execute handler.")
  assert(handlerCalls === 1, "Denied guard must not increment handler calls.")

  const rbacDenied = await withEntitlementGuard({
    context: {
      workspacePlan: activeWorkspacePlan,
      rbac: {
        checked: true,
        allowed: false,
        reason: "Permission denied by precheck.",
      },
    },
    config: {
      featureKey: "test.guard.active",
      actionKey: "test.guard.run",
      mode: "mutation",
      productionSensitive: true,
      requireRbacAllowed: true,
      capabilityRegistry,
    },
    handler: () => {
      handlerCalls += 1
      return { created: true }
    },
  })

  assert(!rbacDenied.ok, "RBAC denied guard must block.")
  assert(
    rbacDenied.error?.code === "RBAC_DENIED",
    "RBAC denied guard must return RBAC_DENIED."
  )
  assert(!rbacDenied.handlerExecuted, "RBAC denied guard must not run handler.")

  const unknownFeature = await withEntitlementGuard({
    context: {
      workspacePlan: activeWorkspacePlan,
    },
    config: {
      featureKey: "test.guard.unknown",
      actionKey: "test.guard.run",
      mode: "mutation",
      capabilityRegistry,
    },
    handler: () => {
      handlerCalls += 1
      return { created: true }
    },
  })

  assert(!unknownFeature.ok, "Unknown feature must block.")
  assert(
    unknownFeature.decision.reasonCode === "ENTITLEMENT_UNKNOWN",
    "Unknown feature must fail closed through entitlement decision."
  )

  const missingPlan = await withEntitlementGuard({
    context: {
      workspacePlan: resolveWorkspacePlan({
        workspace: {
          id: "workspace_without_plan",
          name: "Workspace Without Plan",
          status: "active",
        },
      }),
    },
    config: {
      featureKey: "test.guard.active",
      actionKey: "test.guard.run",
      mode: "mutation",
      productionSensitive: true,
      capabilityRegistry,
    },
    handler: () => {
      handlerCalls += 1
      return { created: true }
    },
  })

  assert(!missingPlan.ok, "Missing plan must block.")
  assert(
    missingPlan.decision.reasonCode === "PLAN_NOT_CONFIGURED",
    "Missing plan must return PLAN_NOT_CONFIGURED."
  )

  const demoProductionMutation = await withEntitlementGuard({
    context: {
      workspacePlan: demoWorkspacePlan,
    },
    config: {
      featureKey: "test.guard.active",
      actionKey: "test.guard.run",
      mode: "mutation",
      productionSensitive: true,
      capabilityRegistry,
    },
    handler: () => {
      handlerCalls += 1
      return { created: true }
    },
  })

  assert(!demoProductionMutation.ok, "Demo production mutation must block.")
  assert(
    !demoProductionMutation.handlerExecuted,
    "Demo production mutation must not execute handler."
  )

  const blockedBeforeCount = handlerCalls
  const blocked = await withEntitlementGuard({
    context: {
      workspacePlan: activeWorkspacePlan,
    },
    config: {
      featureKey: "test.guard.unavailable",
      actionKey: "test.guard.block",
      mode: "mutation",
      productionSensitive: true,
      capabilityRegistry,
    },
    handler: () => {
      handlerCalls += 1
      return { created: true }
    },
  })

  assert(!blocked.handlerExecuted, "Blocked guard must mark handler not executed.")
  assert(
    handlerCalls === blockedBeforeCount,
    "Blocked guard must never execute handler."
  )
  assert(
    blocked.auditMetadata.entitlement.featureKey === "test.guard.unavailable",
    "Audit metadata must include entitlement feature key."
  )
  assert(
    blocked.auditMetadata.guard.blockedReason === "ENTITLEMENT_DENIED",
    "Audit metadata must include guard blocked reason."
  )

  const testMode = await withEntitlementGuard({
    context: {
      workspacePlan: demoWorkspacePlan,
    },
    config: {
      featureKey: "test.guard.test_only",
      actionKey: "test.guard.preview",
      mode: "test",
      productionSensitive: false,
      capabilityRegistry,
    },
    handler: () => {
      handlerCalls += 1
      return { preview: true }
    },
  })

  assert(testMode.ok, "Explicit TEST mode must allow TEST-only capability.")
  assert(
    testMode.handlerExecuted,
    "Explicit TEST mode must execute handler for TEST-only capability."
  )
  assert(
    testMode.auditMetadata.entitlement.mode === "test",
    "Audit metadata must include explicit TEST mode."
  )
}

runTests().then(() => {
  console.log("Entitlement guard helper tests passed")
})

