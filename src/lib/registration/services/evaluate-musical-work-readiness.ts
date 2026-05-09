import type { MusicalWork } from "../contracts/musical-work-contract"

import {
  validateMusicalWork
} from "./validate-musical-work"

import {
  evaluateRegistrationReadiness
} from "./evaluate-registration-readiness"

import {
  createRegistrationAuditEvent
} from "../audit/create-registration-audit-event"

import type {
  RegistrationReadinessResult
} from "../contracts/readiness-rule-contract"

import type { EvidenceType } from "../types/evidence-type"
import type { RegistrationAuditEvent } from "../contracts/registration-audit-contract"

export type EvaluateMusicalWorkReadinessInput = {
  work: MusicalWork
  uploadedEvidenceTypes?: EvidenceType[]
  performedBy?: string
}

export type MusicalWorkReadinessOrchestrationResult = {
  readiness: RegistrationReadinessResult
  auditEvent: RegistrationAuditEvent
}

export function evaluateMusicalWorkReadiness(
  input: EvaluateMusicalWorkReadinessInput
): MusicalWorkReadinessOrchestrationResult {
  const validation = validateMusicalWork(input.work)

  const readiness = evaluateRegistrationReadiness({
    subjectId: input.work.id,
    subjectLayer: "composition",
    conditions: validation.generatedConditions,
    uploadedEvidenceTypes: input.uploadedEvidenceTypes
  })

  const auditEvent = createRegistrationAuditEvent({
    eventType: "readiness.evaluated",
    entityType: "musical_work",
    entityId: input.work.id,
    performedBy: input.performedBy ?? "system",
    reason: "Musical work readiness evaluated",
    metadata: {
      readinessScore: readiness.score,
      ready: readiness.ready,
      blockers: readiness.blockers.length,
      warnings: readiness.warnings.length
    }
  })

  return {
    readiness,
    auditEvent
  }
}
