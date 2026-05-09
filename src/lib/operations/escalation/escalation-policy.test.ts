import { resolveEscalationPolicy } from "./escalation-policy.engine"
import { EscalationPolicy } from "./escalation.types"

const policies: EscalationPolicy[] = [
  {
    id: "policy_dispatch_failure_high",
    code: "DISPATCH_FAILURE_HIGH",
    triggerType: "DISPATCH_FAILURE",
    severity: "HIGH",
    failureThreshold: 3,
    escalationWindowMinutes: 15,
    notifyRoles: ["OPERATIONS_LEAD", "COMPLIANCE_OFFICER"],
    isActive: true,
  },
]

const result = resolveEscalationPolicy(policies, {
  triggerType: "DISPATCH_FAILURE",
  currentFailureCount: 3,
  unresolvedMinutes: 20,
})

if (!result.shouldEscalate) {
  throw new Error("Expected escalation to trigger.")
}

if (result.lifecycleState !== "ESCALATED") {
  throw new Error("Expected lifecycle state ESCALATED.")
}

console.log("Escalation Policy Engine V1 test passed", result)
