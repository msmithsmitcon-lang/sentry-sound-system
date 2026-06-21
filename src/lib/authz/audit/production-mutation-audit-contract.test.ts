import { ProductionMutationAuditHandoff } from "../guards/production-mutation-guard-contract"
import { buildProductionMutationAuditEvent } from "./build-production-mutation-audit-event"

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

const baseGateTrail = [
  {
    gate: "auth",
    ok: true,
  },
  {
    gate: "profile",
    ok: true,
  },
  {
    gate: "workspace",
    ok: true,
  },
  {
    gate: "rbac",
    ok: true,
  },
  {
    gate: "entitlement",
    ok: true,
  },
] as const

const entitlementMetadata = {
  workspaceId: "workspace_1",
  planKey: "ARTIST_PRO",
  featureKey: "works.capture",
  actionKey: "works.create.production",
  decisionStatus: "allowed",
  reasonCode: "ENTITLEMENT_ALLOWED",
}

function buildHandoff(
  overrides: Partial<ProductionMutationAuditHandoff> = {}
): ProductionMutationAuditHandoff {
  return {
    operationKey: "works.capture.production",
    productionSensitive: true,
    status: "blocked",
    blockedAt: "rbac",
    gateTrail: [...baseGateTrail],
    entitlement: entitlementMetadata,
    ...overrides,
  }
}

const blocked = buildProductionMutationAuditEvent({
  handoff: buildHandoff({
    status: "blocked",
    blockedAt: "rbac",
    gateTrail: [
      ...baseGateTrail,
      {
        gate: "rbac",
        ok: false,
        code: "RBAC_DENIED",
      },
    ],
  }),
  eventId: "event_blocked",
  occurredAt: "2026-05-17T00:00:00.000Z",
})

assert(blocked.ok, "Blocked mutation event must build.")
assert(
  blocked.ok && blocked.event.eventType === "production_mutation.blocked",
  "Blocked mutation must map to blocked event type."
)
assert(
  blocked.ok && blocked.event.blockedAt === "rbac",
  "Blocked mutation must preserve blocked gate."
)

const executed = buildProductionMutationAuditEvent({
  handoff: buildHandoff({
    status: "handler_executed",
    blockedAt: undefined,
    mutation: {
      entityType: "musical_work",
      entityId: "work_1",
    },
  }),
  eventId: "event_executed",
  occurredAt: "2026-05-17T00:01:00.000Z",
})

assert(executed.ok, "Executed mutation event must build.")
assert(
  executed.ok && executed.event.eventType === "production_mutation.executed",
  "Executed mutation must map to executed event type."
)

const failed = buildProductionMutationAuditEvent({
  handoff: buildHandoff({
    status: "handler_failed",
    blockedAt: "mutation_handler",
    mutation: {
      errorCode: "HANDLER_FAILED",
    },
  }),
  eventId: "event_failed",
  occurredAt: "2026-05-17T00:02:00.000Z",
})

assert(failed.ok, "Failed mutation event must build.")
assert(
  failed.ok && failed.event.eventType === "production_mutation.failed",
  "Failed mutation must map to failed event type."
)

assert(
  executed.ok && executed.event.gateTrail[0]?.sequence === 1,
  "Gate trail must include sequence numbers."
)
assert(
  executed.ok &&
    executed.event.gateTrail.length === executed.event.gateTrail.length,
  "Gate trail must be preserved."
)
assert(
  executed.ok &&
    executed.event.entitlement?.featureKey === "works.capture",
  "Entitlement metadata must be preserved."
)

const missingOperation = buildProductionMutationAuditEvent({
  handoff: buildHandoff({
    operationKey: "",
  }),
})

assert(!missingOperation.ok, "Missing operation key must fail closed.")
assert(
  !missingOperation.ok &&
    missingOperation.error.code === "AUDIT_OPERATION_KEY_REQUIRED",
  "Missing operation key must return required field error."
)

const missingGateTrail = buildProductionMutationAuditEvent({
  handoff: buildHandoff({
    gateTrail: [],
  }),
})

assert(!missingGateTrail.ok, "Missing gate trail must fail closed.")
assert(
  !missingGateTrail.ok &&
    missingGateTrail.error.code === "AUDIT_GATE_TRAIL_REQUIRED",
  "Missing gate trail must return required field error."
)

const testMarked = buildProductionMutationAuditEvent({
  handoff: buildHandoff(),
  marker: {
    testMode: true,
    nonProduction: true,
    source: "phase_7b_contract_test",
  },
})

assert(testMarked.ok, "TEST/non-production marked event must build.")
assert(
  testMarked.ok && testMarked.event.marker?.testMode === true,
  "TEST marker must be preserved."
)
assert(
  testMarked.ok && testMarked.event.marker?.nonProduction === true,
  "Non-production marker must be preserved."
)

console.log("Production mutation audit contract tests passed")

