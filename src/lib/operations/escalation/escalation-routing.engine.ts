import {
  EscalationRoutingResult,
  EscalationRoutingRule,
} from "./escalation-routing.types"

export function resolveEscalationRouting(params: {
  severity: string
  rules: EscalationRoutingRule[]
}): EscalationRoutingResult {
  const matchedRule = params.rules.find(
    (rule) => rule.severity === params.severity
  )

  if (!matchedRule) {
    return {
      channels: [],
      routingReason:
        "No routing rule matched escalation severity.",
    }
  }

  return {
    channels: matchedRule.channels,

    routingReason:
      `Matched routing rule for severity ${params.severity}.`,
  }
}
