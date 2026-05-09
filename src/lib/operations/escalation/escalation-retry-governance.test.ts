import { evaluateEscalationRetry } from "./escalation-retry-governance.engine"

const allowed = evaluateEscalationRetry({
  currentRetryCount: 1,
  minutesSinceFailure: 30,

  policy: {
    maxRetries: 3,
    retryWindowMinutes: 15,
  },
})

if (!allowed.shouldRetry) {
  throw new Error("Expected retry to be allowed.")
}

const blocked = evaluateEscalationRetry({
  currentRetryCount: 3,
  minutesSinceFailure: 60,

  policy: {
    maxRetries: 3,
    retryWindowMinutes: 15,
  },
})

if (blocked.shouldRetry) {
  throw new Error("Expected retry to be blocked.")
}

console.log("Escalation Retry Governance V1 test passed", {
  allowed,
  blocked,
})
