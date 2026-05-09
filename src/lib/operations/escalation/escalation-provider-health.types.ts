export type EscalationProviderHealthStatus =
  | "HEALTHY"
  | "DEGRADED"
  | "OFFLINE"

export interface EscalationProviderHealth {
  provider: string

  status: EscalationProviderHealthStatus

  lastCheckedAt: Date
}

export interface EscalationProviderHealthEvaluationResult {
  isHealthy: boolean

  provider: string

  status: EscalationProviderHealthStatus

  evaluationReason: string
}
