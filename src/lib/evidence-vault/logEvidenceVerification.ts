import {
  createEvidenceAuditEvent
} from "./createEvidenceAuditEvent"

export interface LogEvidenceVerificationInput {
  evidenceId: string
  actorUserId: string
  previousState?: Record<string, unknown> | null
  nextState?: Record<string, unknown> | null
}

export async function logEvidenceVerification(
  input: LogEvidenceVerificationInput
) {

  return createEvidenceAuditEvent({
    evidenceId: input.evidenceId,
    eventType: "EVIDENCE_VERIFIED",

    actorUserId: input.actorUserId,

    previousState: input.previousState,
    nextState: input.nextState
  })
}
