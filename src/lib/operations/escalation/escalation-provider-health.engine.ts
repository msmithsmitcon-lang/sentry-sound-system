import {
  EscalationProviderHealth,
  EscalationProviderHealthEvaluationResult,
} from "./escalation-provider-health.types"

export function evaluateEscalationProviderHealth(
  health: EscalationProviderHealth
): EscalationProviderHealthEvaluationResult {
  if (health.status !== "HEALTHY") {
    return {
      isHealthy: false,
      provider: health.provider,
      status: health.status,
      evaluationReason: `Provider ${health.provider} is ${health.status}.`,
    }
  }

  return {
    isHealthy: true,
    provider: health.provider,
    status: health.status,
    evaluationReason: `Provider ${health.provider} is healthy.`,
  }
}
