import {
  createEvidenceAuditEvent
} from "./createEvidenceAuditEvent"

export interface LogEvidenceSupersessionInput {
  evidenceId: string
  replacementEvidenceId: string
  actorUserId: string
}

export async function logEvidenceSupersession(
  input: LogEvidenceSupersessionInput
) {

  return createEvidenceAuditEvent({
    evidenceId: input.evidenceId,
    eventType: "EVIDENCE_SUPERSEDED",

    actorUserId: input.actorUserId,

    metadata: {
      replacementEvidenceId:
        input.replacementEvidenceId
    }
  })
}
