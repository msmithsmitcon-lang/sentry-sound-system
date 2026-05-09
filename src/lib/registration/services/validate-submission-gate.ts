import type { RegistrationReadinessResult } from "../contracts/readiness-rule-contract"

import {
  validateRegistrationStatusTransition
} from "./validate-registration-status-transition"

import type { RegistrationStatus } from "../types/registration-status"

export type ValidateSubmissionGateInput = {
  currentStatus: RegistrationStatus
  readiness: RegistrationReadinessResult
}

export type SubmissionGateResult = {
  allowed: boolean
  reasons: string[]
}

export function validateSubmissionGate(
  input: ValidateSubmissionGateInput
): SubmissionGateResult {

  const reasons: string[] = []

  const transition = validateRegistrationStatusTransition({
    from: input.currentStatus,
    to: "submitted"
  })

  if (!transition.valid) {
    reasons.push(
      `Submission transition not allowed from status: ${input.currentStatus}`
    )
  }

  if (!input.readiness.ready) {
    reasons.push(
      "Registration readiness validation failed"
    )
  }

  if (input.readiness.blockers.length > 0) {
    reasons.push(
      `${input.readiness.blockers.length} blocker(s) detected`
    )
  }

  return {
    allowed: reasons.length === 0,
    reasons
  }
}
