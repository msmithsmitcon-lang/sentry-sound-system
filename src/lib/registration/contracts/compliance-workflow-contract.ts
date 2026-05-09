import type {
  RegistrationReadinessResult
} from "./readiness-rule-contract"

import type {
  RegistrationAuditEvent
} from "./registration-audit-contract"

import type {
  RegistrableEntityReference
} from "../types/registrable-entity"

export type ComplianceWorkflowResult<TResolvedEntity> = {
  entity: RegistrableEntityReference

  readiness: RegistrationReadinessResult

  readinessAuditEvent?: RegistrationAuditEvent

  workflowAuditEvent?: RegistrationAuditEvent

  resolvedEntity?: TResolvedEntity

  allowedForSubmission: boolean

  reasons: string[]
}
