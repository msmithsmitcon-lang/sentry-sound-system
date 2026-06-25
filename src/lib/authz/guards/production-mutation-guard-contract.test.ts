import {
  PRODUCTION_MUTATION_GATE_ORDER,
  ProductionMutationGateName,
  ProductionMutationGateResult,
  ProductionMutationGuardGates,
} from "./production-mutation-guard-contract"
import { withProductionMutationGuardContract } from "./with-production-mutation-guard-contract"

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

const operation = {
  key: "works.capture.production",
  resource: "assets",
  action: "create",
  featureKey: "works.capture",
  entitlementActionKey: "works.create.production",
  productionSensitive: true,
} as const

function okGate(
  gate: ProductionMutationGateName,
  order: string[],
  context: unknown = { ok: true }
): ProductionMutationGateResult {
  order.push(gate)

  return {
    ok: true,
    gate,
    context,
    audit: {
      gate,
      ok: true,
    },
  }
}

function blockedGate(
  gate: ProductionMutationGateName,
  order: string[]
): ProductionMutationGateResult {
  order.push(gate)

  return {
    ok: false,
    gate,
    error: {
      code: `${gate.toUpperCase()}_BLOCKED`,
      message: `${gate} blocked.`,
    },
    audit: {
      gate,
      ok: false,
    },
  }
}

function buildGates(input?: {
  order?: string[]
  failAt?: ProductionMutationGateName
  throwAt?: ProductionMutationGateName
  failMutation?: boolean
}): ProductionMutationGuardGates<{ body: string }, { created: boolean }> {
  const order = input?.order ?? []

  const run = (
    gate: ProductionMutationGateName,
    context: unknown = { gate }
  ) => {
    if (input?.throwAt === gate) {
      order.push(gate)
      throw new Error(`${gate} threw.`)
    }

    if (input?.failAt === gate) {
      return blockedGate(gate, order)
    }

    return okGate(gate, order, context)
  }

  return {
    auth: () => run("auth", { actorId: "actor_1" }),
    profile: () => run("profile", { profileId: "profile_1" }),
    workspace: () => run("workspace", { workspaceId: "workspace_1" }),
    rbac: () => run("rbac", { allowed: true }),
    entitlement: () =>
      run("entitlement", {
        allowed: true,
        auditMetadata: {
          featureKey: "works.capture",
          actionKey: "works.create.production",
        },
      }),
    termsOnboarding: () => run("terms_onboarding", { accepted: true }),
    ownershipScope: () => run("ownership_scope", { scoped: true }),
    businessValidation: () =>
      run("business_validation", { valid: true }),
    mutationHandler: () => {
      if (input?.failMutation) {
        return blockedGate("mutation_handler", order)
      }

      return run("mutation_handler", { created: true })
    },
  }
}

async function runTests() {
  const order: string[] = []
  const success = await withProductionMutationGuardContract({
    request: { body: "ok" },
    operation,
    gates: buildGates({ order }),
  })

  assert(success.ok, "Successful guard must pass.")
  assert(
    success.status === "handler_executed",
    "Successful guard must return handler_executed."
  )
  assert(
    JSON.stringify(order) === JSON.stringify(PRODUCTION_MUTATION_GATE_ORDER),
    "Guard must execute gates in exact order."
  )
  assert(
    success.result?.created === true,
    "Successful guard must return mutation handler result."
  )

  for (const gate of PRODUCTION_MUTATION_GATE_ORDER.filter(
    (item) => item !== "mutation_handler"
  )) {
    const failedOrder: string[] = []
    const failed = await withProductionMutationGuardContract({
      request: { body: "blocked" },
      operation,
      gates: buildGates({ order: failedOrder, failAt: gate }),
    })

    assert(!failed.ok, `${gate} failure must block.`)
    assert(failed.status === "blocked", `${gate} failure must be blocked.`)
    assert(failed.blockedAt === gate, `${gate} failure must mark blockedAt.`)
    assert(
      !failedOrder.includes("mutation_handler"),
      `${gate} failure must not execute mutation handler.`
    )
  }

  const thrown = await withProductionMutationGuardContract({
    request: { body: "thrown" },
    operation,
    gates: buildGates({ throwAt: "workspace" }),
  })

  assert(!thrown.ok, "Thrown gate must fail closed.")
  assert(
    thrown.blockedAt === "workspace",
    "Thrown gate must mark the throwing gate."
  )
  assert(
    thrown.error?.code === "PRODUCTION_MUTATION_GATE_THROWN",
    "Thrown gate must return structured thrown error."
  )

  assert(
    success.auditHandoff.gateTrail.length ===
      PRODUCTION_MUTATION_GATE_ORDER.length,
    "Audit handoff must contain full gate trail."
  )
  assert(
    "entitlement" in success.auditHandoff,
    "Audit handoff must include entitlement audit slot."
  )
  assert(
    success.auditHandoff.entitlement?.gate === "entitlement",
    "Entitlement audit slot must contain entitlement gate audit."
  )

  const mutationFailure = await withProductionMutationGuardContract({
    request: { body: "handler-failure" },
    operation,
    gates: buildGates({ failMutation: true }),
  })

  assert(!mutationFailure.ok, "Mutation handler failure must fail.")
  assert(
    mutationFailure.status === "handler_failed",
    "Mutation handler failure must be structured as handler_failed."
  )
  assert(
    mutationFailure.blockedAt === "mutation_handler",
    "Mutation handler failure must mark mutation_handler."
  )
  assert(
    mutationFailure.auditHandoff.gateTrail.at(-1)?.gate ===
      "mutation_handler",
    "Mutation handler failure must appear in audit trail."
  )
}

runTests().then(() => {
  console.log("Production mutation guard contract tests passed")
})

