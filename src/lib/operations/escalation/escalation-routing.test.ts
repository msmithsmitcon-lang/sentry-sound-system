import { resolveEscalationRouting } from "./escalation-routing.engine"
import { EscalationRoutingRule } from "./escalation-routing.types"

const rules: EscalationRoutingRule[] = [
  {
    severity: "HIGH",
    channels: ["EMAIL", "IN_APP"],
  },
  {
    severity: "CRITICAL",
    channels: ["EMAIL", "SMS", "IN_APP", "EXECUTIVE_REPORT"],
  },
]

const result = resolveEscalationRouting({
  severity: "CRITICAL",
  rules,
})

if (!result.channels.includes("EXECUTIVE_REPORT")) {
  throw new Error("Expected CRITICAL escalation to route to EXECUTIVE_REPORT.")
}

if (!result.channels.includes("SMS")) {
  throw new Error("Expected CRITICAL escalation to route to SMS.")
}

console.log("Escalation Routing Governance V1 test passed", result)
