import {
  evaluateAndPersistMusicalWorkReadiness
} from "./evaluate-and-persist-musical-work-readiness"

import {
  resolveAndPersistMusicalWorkStatus
} from "./resolve-and-persist-musical-work-status"

export async function runMusicalWorkComplianceWorkflow(input: {
  musicalWorkId: string

  uploadedEvidenceTypes?: string[]

  performedBy?: string
}) {

  const readinessWorkflow =
    await evaluateAndPersistMusicalWorkReadiness({
      musicalWorkId: input.musicalWorkId,

      uploadedEvidenceTypes:
        input.uploadedEvidenceTypes,

      performedBy: input.performedBy
    })

  const resolvedEntity =
    await resolveAndPersistMusicalWorkStatus({
      musicalWorkId: input.musicalWorkId,

      readiness:
        readinessWorkflow.readiness,

      performedBy: input.performedBy
    })

  return {
    readiness:
      readinessWorkflow.readiness,

    readinessAuditEvent:
      readinessWorkflow.auditEvent,

    resolvedEntity
  }
}
