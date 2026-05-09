import type {
  RegistrationReadinessResult
} from "./readiness-rule-contract"

export type WorkflowStatusResolutionInput = {
  readiness: RegistrationReadinessResult
}

export type WorkflowStatusResolutionResult = {
  resolvedStatus: string

  allowedForSubmission: boolean

  reasons: string[]
}
