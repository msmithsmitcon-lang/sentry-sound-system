import {
  createEvidenceAuditEvent
} from "./createEvidenceAuditEvent"

export interface LogEvidenceRejectionInput {
  evidenceId: string
  actorUserId: string
  reason: string

  previousState?: Record<string, unknown> | null
  nextState?: Record<string, unknown> | null
}

export async function logEvidenceRejection(
  input: LogEvidenceRejectionInput
) {

  return createEvidenceAuditEvent({
    evidenceId: input.evidenceId,
    eventType: "EVIDENCE_REJECTED",

    actorUserId: input.actorUserId,

    previousState: input.previousState,
    nextState: input.nextState,

    metadata: {
      reason: input.reason
    }
  })
}
