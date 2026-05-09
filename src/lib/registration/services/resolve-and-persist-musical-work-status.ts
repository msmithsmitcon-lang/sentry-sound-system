import {
  updateMusicalWorkStatus
} from "../repositories/musical-work-repository"

import {
  createRegistrationAuditEventRecord
} from "../repositories/registration-audit-repository"

import type {
  RegistrationReadinessResult
} from "../contracts/readiness-rule-contract"

export async function resolveAndPersistMusicalWorkStatus(input: {
  musicalWorkId: string

  readiness: RegistrationReadinessResult

  performedBy?: string
}) {

  let resolvedStatus = "draft"

  if (input.readiness.ready) {
    resolvedStatus = "ready_for_submission"
  }
  else if (input.readiness.blockers.length > 0) {
    resolvedStatus = "metadata_incomplete"
  }

  const updated =
    await updateMusicalWorkStatus({
      id: input.musicalWorkId,
      status: resolvedStatus
    })

  await createRegistrationAuditEventRecord({
    eventType: "registration.updated",

    entityType: "musical_work",
    entityId: input.musicalWorkId,

    performedBy: input.performedBy,

    reason:
      "Automatic workflow status resolution",

    metadata: {
      resolvedStatus,
      readinessScore: input.readiness.score,
      blockers:
        input.readiness.blockers.length
    },

    musicalWorkId: input.musicalWorkId
  })

  return updated
}
