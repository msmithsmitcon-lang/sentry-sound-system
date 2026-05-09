import {
  resolveWorkflowStatus
} from "./resolve-workflow-status"

import type {
  RegistrableEntityReference
} from "../types/registrable-entity"

import type {
  RegistrationReadinessResult
} from "../contracts/readiness-rule-contract"

import type {
  GenericComplianceWorkflowResult
} from "../contracts/generic-compliance-workflow-contract"

export function buildGenericComplianceWorkflowResult<
  TResolvedEntity
>(input: {
  entity: RegistrableEntityReference

  readiness: RegistrationReadinessResult

  readinessAuditEvent?: unknown

  workflowAuditEvent?: unknown

  resolvedEntity?: TResolvedEntity
}): GenericComplianceWorkflowResult<
  TResolvedEntity
> {

  const workflowResolution =
    resolveWorkflowStatus({
      readiness: input.readiness
    })

  return {
    entity: input.entity,

    readiness: input.readiness,

    workflowResolution,

    readinessAuditEvent:
      input.readinessAuditEvent,

    workflowAuditEvent:
      input.workflowAuditEvent,

    resolvedEntity:
      input.resolvedEntity
  }
}
