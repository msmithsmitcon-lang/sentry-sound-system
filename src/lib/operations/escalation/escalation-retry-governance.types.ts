export interface EscalationRetryPolicy {
  maxRetries: number

  retryWindowMinutes: number
}

export interface EscalationRetryEvaluationInput {
  currentRetryCount: number

  minutesSinceFailure: number

  policy: EscalationRetryPolicy
}

export interface EscalationRetryEvaluationResult {
  shouldRetry: boolean

  nextRetryAllowed: boolean

  reason: string
}
