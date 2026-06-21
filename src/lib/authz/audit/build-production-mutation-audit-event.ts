import {
  BuildProductionMutationAuditEventInput,
  ProductionMutationAuditBuildError,
  ProductionMutationAuditBuildResult,
  ProductionMutationAuditEventType,
} from "./production-mutation-audit-contract"
import { ProductionMutationGuardStatus } from "../guards/production-mutation-guard-contract"

export function buildProductionMutationAuditEvent(
  input: BuildProductionMutationAuditEventInput
): ProductionMutationAuditBuildResult {
  const validationError = validateHandoff(input.handoff)

  if (validationError) {
    return {
      ok: false,
      error: validationError,
    }
  }

  const eventType = mapStatusToAuditEventType(input.handoff.status)

  if (!eventType) {
    return {
      ok: false,
      error: {
        code: "AUDIT_UNKNOWN_STATUS",
        message: "Production mutation audit status is unknown.",
      },
    }
  }

  return {
    ok: true,
    event: {
      eventId:
        input.eventId ??
        buildDeterministicEventId(
          input.handoff.operationKey,
          input.handoff.status,
          input.handoff.gateTrail.length
        ),
      eventType,
      operationKey: input.handoff.operationKey,
      productionSensitive: true,
      status: input.handoff.status,
      blockedAt: input.handoff.blockedAt,
      actor: input.actor,
      workspace: input.workspace,
      target: input.target,
      rbac: input.handoff.rbac,
      entitlement: input.handoff.entitlement,
      termsOnboarding: input.handoff.termsOnboarding,
      ownershipScope: input.handoff.ownershipScope,
      businessValidation: input.handoff.businessValidation,
      mutation: input.handoff.mutation,
      gateTrail: input.handoff.gateTrail.map((item, index) => ({
        ...item,
        sequence: index + 1,
      })),
      marker: input.marker,
      metadata: input.metadata,
      occurredAt: input.occurredAt ?? new Date().toISOString(),
    },
  }
}

export function mapStatusToAuditEventType(
  status: ProductionMutationGuardStatus
): ProductionMutationAuditEventType | null {
  switch (status) {
    case "blocked":
      return "production_mutation.blocked"
    case "handler_executed":
      return "production_mutation.executed"
    case "handler_failed":
      return "production_mutation.failed"
    default:
      return null
  }
}

function validateHandoff(
  handoff: BuildProductionMutationAuditEventInput["handoff"]
): ProductionMutationAuditBuildError | null {
  if (!handoff.operationKey) {
    return {
      code: "AUDIT_OPERATION_KEY_REQUIRED",
      message: "Production mutation audit operation key is required.",
    }
  }

  if (handoff.productionSensitive !== true) {
    return {
      code: "AUDIT_PRODUCTION_SENSITIVE_REQUIRED",
      message: "Production mutation audit must be production-sensitive.",
    }
  }

  if (!handoff.status) {
    return {
      code: "AUDIT_STATUS_REQUIRED",
      message: "Production mutation audit status is required.",
    }
  }

  if (!Array.isArray(handoff.gateTrail) || handoff.gateTrail.length === 0) {
    return {
      code: "AUDIT_GATE_TRAIL_REQUIRED",
      message: "Production mutation audit gate trail is required.",
    }
  }

  return null
}

function buildDeterministicEventId(
  operationKey: string,
  status: string,
  gateTrailLength: number
): string {
  return [
    "production_mutation_audit",
    operationKey.replace(/[^a-zA-Z0-9]+/g, "_"),
    status,
    gateTrailLength,
  ].join("_")
}

