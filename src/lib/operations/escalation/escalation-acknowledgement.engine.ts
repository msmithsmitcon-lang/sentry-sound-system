import {
  EscalationAcknowledgement,
  EscalationAcknowledgementResult,
} from "./escalation-acknowledgement.types"

export function resolveEscalationAcknowledgement(params: {
  escalationId: string
  acknowledgements: EscalationAcknowledgement[]
}): EscalationAcknowledgementResult {
  const acknowledgement = params.acknowledgements.find(
    (item) => item.escalationId === params.escalationId
  )

  if (!acknowledgement) {
    return {
      isAcknowledged: false,
      reason: "No acknowledgement found for escalation.",
    }
  }

  return {
    isAcknowledged: true,
    acknowledgedByRole: acknowledgement.acknowledgedByRole,
    acknowledgedAt: acknowledgement.acknowledgedAt,
    reason: `Escalation acknowledged by ${acknowledgement.acknowledgedByRole}.`,
  }
}
