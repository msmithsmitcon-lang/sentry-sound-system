import { randomUUID } from "crypto"
import { resolveEscalationPolicy } from "./escalation-policy.engine"
import { persistEscalationEvent } from "./escalation-persistence.service"
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

async function main() {
  const resolution = resolveEscalationPolicy(policies, {
    triggerType: "DISPATCH_FAILURE",
    currentFailureCount: 3,
    unresolvedMinutes: 20,
  })

  const event = await persistEscalationEvent({
    id: randomUUID(),
    triggerType: "DISPATCH_FAILURE",
    resolution,
  })

  if (!event.id) {
    throw new Error("Expected persisted escalation event id.")
  }

  if (event.lifecycle_state !== "ESCALATED") {
    throw new Error("Expected persisted lifecycle_state ESCALATED.")
  }

  console.log("Escalation persistence test passed", event)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
