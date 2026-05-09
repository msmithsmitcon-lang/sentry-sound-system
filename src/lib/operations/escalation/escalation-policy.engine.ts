import {
  EscalationPolicy,
  EscalationResolutionInput,
  EscalationResolutionResult,
} from "./escalation.types"

export function resolveEscalationPolicy(
  policies: EscalationPolicy[],
  input: EscalationResolutionInput
): EscalationResolutionResult {
  const activePolicies = policies.filter(
    (policy) =>
      policy.isActive &&
      policy.triggerType === input.triggerType
  )

  const matchedPolicy = activePolicies.find(
    (policy) =>
      input.currentFailureCount >= policy.failureThreshold &&
      input.unresolvedMinutes >= policy.escalationWindowMinutes
  )

  if (!matchedPolicy) {
    return {
      shouldEscalate: false,
      lifecycleState: "OPEN",
      reasons: ["No active escalation policy threshold was met."],
    }
  }

  return {
    shouldEscalate: true,
    matchedPolicy,
    resolvedSeverity: matchedPolicy.severity,
    lifecycleState: "ESCALATED",
    reasons: [
      `Matched escalation policy ${matchedPolicy.code}.`,
      `Failure count ${input.currentFailureCount} met threshold ${matchedPolicy.failureThreshold}.`,
      `Unresolved minutes ${input.unresolvedMinutes} met window ${matchedPolicy.escalationWindowMinutes}.`,
    ],
  }
}
