export const PRODUCTION_MUTATION_GATE_ORDER = [
  "auth",
  "profile",
  "workspace",
  "rbac",
  "entitlement",
  "terms_onboarding",
  "ownership_scope",
  "business_validation",
  "mutation_handler",
] as const

export type ProductionMutationGateName =
  (typeof PRODUCTION_MUTATION_GATE_ORDER)[number]

export type ProductionMutationGuardStatus =
  | "blocked"
  | "handler_executed"
  | "handler_failed"

export type ProductionMutationOperation = {
  key: string
  resource: string
  action: string
  featureKey: string
  entitlementActionKey: string
  productionSensitive: true
}

export type ProductionMutationGuardError = {
  code: string
  message: string
}

export type ProductionMutationGateAudit = Record<string, unknown>

export type ProductionMutationGateResult<TContext = unknown> = {
  ok: boolean
  gate: ProductionMutationGateName
  context?: TContext
  error?: ProductionMutationGuardError
  audit?: ProductionMutationGateAudit
}

export type ProductionMutationGuardAccumulatedContext = {
  auth?: unknown
  profile?: unknown
  workspace?: unknown
  rbac?: unknown
  entitlement?: unknown
  termsOnboarding?: unknown
  ownershipScope?: unknown
  businessValidation?: unknown
}

export type ProductionMutationGateInput<TRequest = unknown> = {
  request: TRequest
  operation: ProductionMutationOperation
  context: ProductionMutationGuardAccumulatedContext
}

export type ProductionMutationHandlerInput<TRequest = unknown> =
  ProductionMutationGateInput<TRequest>

export type ProductionMutationGuardGates<TRequest = unknown, TResult = unknown> =
  {
    auth: (
      input: ProductionMutationGateInput<TRequest>
    ) => Promise<ProductionMutationGateResult> | ProductionMutationGateResult
    profile: (
      input: ProductionMutationGateInput<TRequest>
    ) => Promise<ProductionMutationGateResult> | ProductionMutationGateResult
    workspace: (
      input: ProductionMutationGateInput<TRequest>
    ) => Promise<ProductionMutationGateResult> | ProductionMutationGateResult
    rbac: (
      input: ProductionMutationGateInput<TRequest>
    ) => Promise<ProductionMutationGateResult> | ProductionMutationGateResult
    entitlement: (
      input: ProductionMutationGateInput<TRequest>
    ) => Promise<ProductionMutationGateResult> | ProductionMutationGateResult
    termsOnboarding: (
      input: ProductionMutationGateInput<TRequest>
    ) => Promise<ProductionMutationGateResult> | ProductionMutationGateResult
    ownershipScope: (
      input: ProductionMutationGateInput<TRequest>
    ) => Promise<ProductionMutationGateResult> | ProductionMutationGateResult
    businessValidation: (
      input: ProductionMutationGateInput<TRequest>
    ) => Promise<ProductionMutationGateResult> | ProductionMutationGateResult
    mutationHandler: (
      input: ProductionMutationHandlerInput<TRequest>
    ) => Promise<ProductionMutationGateResult<TResult>> | ProductionMutationGateResult<TResult>
  }

export type ProductionMutationGuardInput<TRequest = unknown, TResult = unknown> =
  {
    request: TRequest
    operation: ProductionMutationOperation
    gates: ProductionMutationGuardGates<TRequest, TResult>
  }

export type ProductionMutationGateTrailItem = {
  gate: ProductionMutationGateName
  ok: boolean
  code?: string
}

export type ProductionMutationAuditHandoff = {
  operationKey: string
  productionSensitive: true
  status: ProductionMutationGuardStatus
  blockedAt?: ProductionMutationGateName
  gateTrail: ProductionMutationGateTrailItem[]
  auth?: ProductionMutationGateAudit | null
  profile?: ProductionMutationGateAudit | null
  workspace?: ProductionMutationGateAudit | null
  rbac?: ProductionMutationGateAudit | null
  entitlement: ProductionMutationGateAudit | null
  termsOnboarding?: ProductionMutationGateAudit | null
  ownershipScope?: ProductionMutationGateAudit | null
  businessValidation?: ProductionMutationGateAudit | null
  mutation?: ProductionMutationGateAudit | null
}

export type ProductionMutationGuardResult<TResult = unknown> = {
  ok: boolean
  status: ProductionMutationGuardStatus
  blockedAt?: ProductionMutationGateName
  result?: TResult
  error?: ProductionMutationGuardError
  context: ProductionMutationGuardAccumulatedContext
  auditHandoff: ProductionMutationAuditHandoff
}

export type ProductionMutationGateRunner = <
  TRequest = unknown,
  TResult = unknown,
>(
  input: ProductionMutationGuardInput<TRequest, TResult>
) => Promise<ProductionMutationGuardResult<TResult>>

