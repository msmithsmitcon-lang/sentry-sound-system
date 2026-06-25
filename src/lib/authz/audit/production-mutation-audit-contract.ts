import {
  ProductionMutationAuditHandoff,
  ProductionMutationGateName,
  ProductionMutationGateTrailItem,
  ProductionMutationGuardStatus,
} from "../guards/production-mutation-guard-contract"

export type ProductionMutationAuditEventType =
  | "production_mutation.blocked"
  | "production_mutation.executed"
  | "production_mutation.failed"

export type ProductionMutationAuditMarker = {
  testMode?: boolean
  nonProduction?: boolean
  source?: string
}

export type ProductionMutationAuditActor = {
  actorId?: string | null
  actorType?: string | null
  profileId?: string | null
}

export type ProductionMutationAuditWorkspace = {
  workspaceId?: string | null
  workspaceName?: string | null
  planKey?: string | null
}

export type ProductionMutationAuditTarget = {
  entityType?: string | null
  entityId?: string | null
  workspaceId?: string | null
}

export type ProductionMutationDurableGateTrailItem =
  ProductionMutationGateTrailItem & {
    sequence: number
  }

export type ProductionMutationAuditEvent = {
  eventId: string
  eventType: ProductionMutationAuditEventType
  operationKey: string
  productionSensitive: true
  status: ProductionMutationGuardStatus
  blockedAt?: ProductionMutationGateName
  actor?: ProductionMutationAuditActor
  workspace?: ProductionMutationAuditWorkspace
  target?: ProductionMutationAuditTarget
  rbac?: Record<string, unknown> | null
  entitlement: Record<string, unknown> | null
  termsOnboarding?: Record<string, unknown> | null
  ownershipScope?: Record<string, unknown> | null
  businessValidation?: Record<string, unknown> | null
  mutation?: Record<string, unknown> | null
  gateTrail: ProductionMutationDurableGateTrailItem[]
  marker?: ProductionMutationAuditMarker
  metadata?: Record<string, unknown>
  occurredAt: string
}

export type BuildProductionMutationAuditEventInput = {
  handoff: ProductionMutationAuditHandoff
  eventId?: string
  occurredAt?: string
  actor?: ProductionMutationAuditActor
  workspace?: ProductionMutationAuditWorkspace
  target?: ProductionMutationAuditTarget
  marker?: ProductionMutationAuditMarker
  metadata?: Record<string, unknown>
}

export type ProductionMutationAuditBuildErrorCode =
  | "AUDIT_OPERATION_KEY_REQUIRED"
  | "AUDIT_PRODUCTION_SENSITIVE_REQUIRED"
  | "AUDIT_STATUS_REQUIRED"
  | "AUDIT_GATE_TRAIL_REQUIRED"
  | "AUDIT_UNKNOWN_STATUS"

export type ProductionMutationAuditBuildError = {
  code: ProductionMutationAuditBuildErrorCode
  message: string
}

export type ProductionMutationAuditBuildResult =
  | {
      ok: true
      event: ProductionMutationAuditEvent
    }
  | {
      ok: false
      error: ProductionMutationAuditBuildError
    }

