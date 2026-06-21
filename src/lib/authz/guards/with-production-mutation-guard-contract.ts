import {
  PRODUCTION_MUTATION_GATE_ORDER,
  ProductionMutationAuditHandoff,
  ProductionMutationGateName,
  ProductionMutationGateResult,
  ProductionMutationGuardAccumulatedContext,
  ProductionMutationGuardError,
  ProductionMutationGuardGates,
  ProductionMutationGuardInput,
  ProductionMutationGuardResult,
  ProductionMutationGuardStatus,
} from "./production-mutation-guard-contract"

export async function withProductionMutationGuardContract<
  TRequest = unknown,
  TResult = unknown,
>(
  input: ProductionMutationGuardInput<TRequest, TResult>
): Promise<ProductionMutationGuardResult<TResult>> {
  const context: ProductionMutationGuardAccumulatedContext = {}
  const audit = createAuditHandoff(input.operation.key)

  for (const gate of PRODUCTION_MUTATION_GATE_ORDER) {
    const gateResult = await runGate({
      gate,
      gates: input.gates,
      request: input.request,
      operation: input.operation,
      context,
    })

    appendAudit({
      audit,
      gate,
      result: gateResult,
    })

    if (!gateResult.ok) {
      const status =
        gate === "mutation_handler" ? "handler_failed" : "blocked"

      audit.status = status
      audit.blockedAt = gate

      return {
        ok: false,
        status,
        blockedAt: gate,
        error:
          gateResult.error ??
          buildGuardError("PRODUCTION_MUTATION_GATE_BLOCKED", gate),
        context,
        auditHandoff: audit,
      }
    }

    assignGateContext(context, gate, gateResult.context)

    if (gate === "mutation_handler") {
      audit.status = "handler_executed"

      return {
        ok: true,
        status: "handler_executed",
        result: gateResult.context as TResult,
        context,
        auditHandoff: audit,
      }
    }
  }

  audit.status = "blocked"

  return {
    ok: false,
    status: "blocked",
    error: buildGuardError("PRODUCTION_MUTATION_ORDER_INCOMPLETE"),
    context,
    auditHandoff: audit,
  }
}

async function runGate<TRequest, TResult>(input: {
  gate: ProductionMutationGateName
  gates: ProductionMutationGuardGates<TRequest, TResult>
  request: TRequest
  operation: ProductionMutationGuardInput<TRequest, TResult>["operation"]
  context: ProductionMutationGuardAccumulatedContext
}): Promise<ProductionMutationGateResult> {
  const gateFn = getGateFn(input.gates, input.gate)

  if (!gateFn) {
    return {
      ok: false,
      gate: input.gate,
      error: buildGuardError("PRODUCTION_MUTATION_GATE_MISSING", input.gate),
    }
  }

  try {
    const result = await gateFn({
      request: input.request,
      operation: input.operation,
      context: input.context,
    })

    if (result.gate !== input.gate) {
      return {
        ok: false,
        gate: input.gate,
        error: buildGuardError("PRODUCTION_MUTATION_GATE_MISMATCH", input.gate),
        audit: result.audit,
      }
    }

    return result
  } catch (error) {
    return {
      ok: false,
      gate: input.gate,
      error: {
        code: "PRODUCTION_MUTATION_GATE_THROWN",
        message:
          error instanceof Error
            ? error.message
            : `Production mutation gate ${input.gate} threw.`,
      },
    }
  }
}

function getGateFn<TRequest, TResult>(
  gates: ProductionMutationGuardGates<TRequest, TResult>,
  gate: ProductionMutationGateName
) {
  switch (gate) {
    case "auth":
      return gates.auth
    case "profile":
      return gates.profile
    case "workspace":
      return gates.workspace
    case "rbac":
      return gates.rbac
    case "entitlement":
      return gates.entitlement
    case "terms_onboarding":
      return gates.termsOnboarding
    case "ownership_scope":
      return gates.ownershipScope
    case "business_validation":
      return gates.businessValidation
    case "mutation_handler":
      return gates.mutationHandler
  }
}

function assignGateContext(
  context: ProductionMutationGuardAccumulatedContext,
  gate: ProductionMutationGateName,
  value: unknown
) {
  switch (gate) {
    case "auth":
      context.auth = value
      break
    case "profile":
      context.profile = value
      break
    case "workspace":
      context.workspace = value
      break
    case "rbac":
      context.rbac = value
      break
    case "entitlement":
      context.entitlement = value
      break
    case "terms_onboarding":
      context.termsOnboarding = value
      break
    case "ownership_scope":
      context.ownershipScope = value
      break
    case "business_validation":
      context.businessValidation = value
      break
    case "mutation_handler":
      break
  }
}

function createAuditHandoff(operationKey: string): ProductionMutationAuditHandoff {
  return {
    operationKey,
    productionSensitive: true,
    status: "blocked",
    gateTrail: [],
    entitlement: null,
  }
}

function appendAudit(input: {
  audit: ProductionMutationAuditHandoff
  gate: ProductionMutationGateName
  result: ProductionMutationGateResult
}) {
  input.audit.gateTrail.push({
    gate: input.gate,
    ok: input.result.ok,
    code: input.result.error?.code,
  })

  switch (input.gate) {
    case "auth":
      input.audit.auth = input.result.audit ?? null
      break
    case "profile":
      input.audit.profile = input.result.audit ?? null
      break
    case "workspace":
      input.audit.workspace = input.result.audit ?? null
      break
    case "rbac":
      input.audit.rbac = input.result.audit ?? null
      break
    case "entitlement":
      input.audit.entitlement = input.result.audit ?? null
      break
    case "terms_onboarding":
      input.audit.termsOnboarding = input.result.audit ?? null
      break
    case "ownership_scope":
      input.audit.ownershipScope = input.result.audit ?? null
      break
    case "business_validation":
      input.audit.businessValidation = input.result.audit ?? null
      break
    case "mutation_handler":
      input.audit.mutation = input.result.audit ?? null
      break
  }
}

function buildGuardError(
  code: string,
  gate?: ProductionMutationGateName
): ProductionMutationGuardError {
  return {
    code,
    message: gate
      ? `Production mutation gate ${gate} blocked.`
      : "Production mutation guard blocked.",
  }
}

