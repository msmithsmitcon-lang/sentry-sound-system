import {
  EscalationRetryEvaluationInput,
  EscalationRetryEvaluationResult,
} from "./escalation-retry-governance.types"

export function evaluateEscalationRetry(
  input: EscalationRetryEvaluationInput
): EscalationRetryEvaluationResult {
  if (input.currentRetryCount >= input.policy.maxRetries) {
    return {
      shouldRetry: false,
      nextRetryAllowed: false,
      reason: "Maximum retry count reached.",
    }
  }

  if (input.minutesSinceFailure < input.policy.retryWindowMinutes) {
    return {
      shouldRetry: false,
      nextRetryAllowed: false,
      reason: "Retry window has not elapsed.",
    }
  }

  return {
    shouldRetry: true,
    nextRetryAllowed: true,
    reason: "Retry permitted by governance policy.",
  }
}
