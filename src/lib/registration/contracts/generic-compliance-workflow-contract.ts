import type {
  RegistrableEntityReference
} from "../types/registrable-entity"

import type {
  RegistrationReadinessResult
} from "./readiness-rule-contract"

import type {
  WorkflowStatusResolutionResult
} from "./workflow-status-resolution-contract"

import type {
  RegistrationAuditEvent
} from "./registration-audit-contract"

export type GenericComplianceWorkflowResult<
  TResolvedEntity
> = {
  entity: RegistrableEntityReference

  readiness: RegistrationReadinessResult

  workflowResolution:
    WorkflowStatusResolutionResult

  readinessAuditEvent?:
    RegistrationAuditEvent

  workflowAuditEvent?:
    RegistrationAuditEvent

  resolvedEntity?: TResolvedEntity
}
