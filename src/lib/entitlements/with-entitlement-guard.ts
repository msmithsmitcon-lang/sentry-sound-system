import { checkEntitlement } from "./check-entitlement"
import {
  EntitlementGuardAuditMetadata,
  EntitlementGuardConfig,
  EntitlementGuardContext,
  EntitlementGuardErrorCode,
  EntitlementGuardHandler,
  EntitlementGuardOutcome,
  EntitlementGuardResult,
} from "./entitlement-guard"
import { EntitlementDecision } from "./entitlement-decision"

export async function withEntitlementGuard<TResult>(input: {
  context: EntitlementGuardContext
  config: EntitlementGuardConfig
  handler: EntitlementGuardHandler<TResult>
}): Promise<EntitlementGuardResult<TResult>> {
  const decision = checkEntitlement({
    workspacePlan: input.context.workspacePlan,
    featureKey: input.config.featureKey,
    actionKey: input.config.actionKey,
    mode: input.config.mode,
    productionSensitive: input.config.productionSensitive,
    quota: input.context.quota,
    capabilityRegistry: input.config.capabilityRegistry,
  })

  const rbacDenied =
    input.config.requireRbacAllowed === true &&
    input.context.rbac?.allowed !== true

  if (rbacDenied) {
    return buildBlockedResult({
      context: input.context,
      config: input.config,
      decision,
      code: "RBAC_DENIED",
      message: input.context.rbac?.reason ?? "RBAC permission denied.",
    })
  }

  if (!decision.allowed) {
    return buildBlockedResult({
      context: input.context,
      config: input.config,
      decision,
      code: "ENTITLEMENT_DENIED",
      message: `Entitlement denied: ${decision.reasonCode}.`,
    })
  }

  const result = await input.handler(input.context)

  return {
    ok: true,
    outcome: "executed",
    handlerExecuted: true,
    decision,
    result,
    auditMetadata: buildAuditMetadata({
      context: input.context,
      config: input.config,
      decision,
      outcome: "executed",
      handlerExecuted: true,
    }),
  }
}

function buildBlockedResult<TResult>(input: {
  context: EntitlementGuardContext
  config: EntitlementGuardConfig
  decision: EntitlementDecision
  code: EntitlementGuardErrorCode
  message: string
}): EntitlementGuardResult<TResult> {
  return {
    ok: false,
    outcome: "blocked",
    handlerExecuted: false,
    decision: input.decision,
    error: {
      code: input.code,
      message: input.message,
    },
    auditMetadata: buildAuditMetadata({
      context: input.context,
      config: input.config,
      decision: input.decision,
      outcome: "blocked",
      handlerExecuted: false,
      blockedReason: input.code,
    }),
  }
}

function buildAuditMetadata(input: {
  context: EntitlementGuardContext
  config: EntitlementGuardConfig
  decision: EntitlementDecision
  outcome: EntitlementGuardOutcome
  handlerExecuted: boolean
  blockedReason?: EntitlementGuardErrorCode
}): EntitlementGuardAuditMetadata {
  return {
    actorId: input.context.actorId ?? null,
    workspaceId:
      input.context.workspaceId ??
      input.context.workspacePlan?.workspaceId ??
      input.decision.workspaceId,
    entitlement: input.decision.auditMetadata,
    guard: {
      outcome: input.outcome,
      handlerExecuted: input.handlerExecuted,
      requireRbacAllowed: input.config.requireRbacAllowed === true,
      rbacAllowed: input.context.rbac?.allowed,
      blockedReason: input.blockedReason,
    },
    rbac: input.context.rbac,
  }
}

