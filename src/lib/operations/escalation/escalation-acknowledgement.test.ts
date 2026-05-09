import { resolveEscalationAcknowledgement } from "./escalation-acknowledgement.engine"

const result = resolveEscalationAcknowledgement({
  escalationId: "esc_001",
  acknowledgements: [
    {
      escalationId: "esc_001",
      acknowledgedByRole: "OPERATIONS_LEAD",
      acknowledgedAt: new Date(),
    },
  ],
})

if (!result.isAcknowledged) {
  throw new Error("Expected escalation to be acknowledged.")
}

if (result.acknowledgedByRole !== "OPERATIONS_LEAD") {
  throw new Error("Expected acknowledgement by OPERATIONS_LEAD.")
}

console.log("Escalation Acknowledgement Governance V1 test passed", result)
