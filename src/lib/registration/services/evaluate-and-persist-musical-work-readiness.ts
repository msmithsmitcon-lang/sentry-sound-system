import {
  getMusicalWorkById,
  updateMusicalWorkReadiness
} from "../repositories/musical-work-repository"

import {
  createRegistrationAuditEventRecord
} from "../repositories/registration-audit-repository"

import {
  evaluateMusicalWorkReadiness
} from "./evaluate-musical-work-readiness"

export async function evaluateAndPersistMusicalWorkReadiness(input: {
  musicalWorkId: string

  uploadedEvidenceTypes?: string[]

  performedBy?: string
}) {

  const work = await getMusicalWorkById(
    input.musicalWorkId
  )

  if (!work) {
    throw new Error("Musical work not found")
  }

  const orchestration =
    evaluateMusicalWorkReadiness({
      work: {
        ...work,
        contributors: []
      },
      uploadedEvidenceTypes:
        input.uploadedEvidenceTypes,
      performedBy: input.performedBy
    })

  await updateMusicalWorkReadiness({
    id: work.id,
    readinessScore:
      orchestration.readiness.score
  })

  await createRegistrationAuditEventRecord({
    eventType:
      orchestration.auditEvent.eventType,

    entityType:
      orchestration.auditEvent.entityType,

    entityId:
      orchestration.auditEvent.entityId,

    performedBy:
      orchestration.auditEvent.performedBy,

    reason:
      orchestration.auditEvent.reason,

    metadata:
      orchestration.auditEvent.metadata,

    musicalWorkId: work.id
  })

  return orchestration
}
