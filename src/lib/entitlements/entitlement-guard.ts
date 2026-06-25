import {
  EntitlementActionKey,
  EntitlementFeatureKey,
} from "./types"
import {
  CheckEntitlementInput,
  EntitlementDecision,
  EntitlementDecisionAuditMetadata,
  EntitlementDecisionMode,
  EntitlementQuotaDecisionInput,
} from "./entitlement-decision"
import { WorkspacePlanContext } from "./workspace-plan-status"

export type EntitlementGuardOutcome = "executed" | "blocked"

export type EntitlementGuardErrorCode =
  | "RBAC_DENIED"
  | "ENTITLEMENT_DENIED"
  | "HANDLER_NOT_EXECUTED"

export type EntitlementGuardRbacContext = {
  checked: boolean
  allowed: boolean
  resource?: string
  action?: string
  reason?: string
}

export type EntitlementGuardContext = {
  actorId?: string | null
  workspaceId?: string | null
  workspacePlan?: WorkspacePlanContext | null
  rbac?: EntitlementGuardRbacContext
  quota?: EntitlementQuotaDecisionInput
}

export type EntitlementGuardConfig = {
  featureKey: EntitlementFeatureKey
  actionKey: EntitlementActionKey
  mode: EntitlementDecisionMode
  productionSensitive?: boolean
  requireRbacAllowed?: boolean
  capabilityRegistry?: CheckEntitlementInput["capabilityRegistry"]
}

export type EntitlementGuardAuditMetadata = {
  actorId?: string | null
  workspaceId?: string | null
  entitlement: EntitlementDecisionAuditMetadata
  guard: {
    outcome: EntitlementGuardOutcome
    handlerExecuted: boolean
    requireRbacAllowed: boolean
    rbacAllowed?: boolean
    blockedReason?: EntitlementGuardErrorCode
  }
  rbac?: EntitlementGuardRbacContext
}

export type EntitlementGuardResult<TResult = unknown> = {
  ok: boolean
  outcome: EntitlementGuardOutcome
  handlerExecuted: boolean
  decision: EntitlementDecision
  result?: TResult
  error?: {
    code: EntitlementGuardErrorCode
    message: string
  }
  auditMetadata: EntitlementGuardAuditMetadata
}

export type EntitlementGuardHandler<TResult> = (
  context: EntitlementGuardContext
) => Promise<TResult> | TResult

