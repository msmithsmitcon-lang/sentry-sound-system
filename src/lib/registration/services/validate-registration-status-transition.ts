import type { RegistrationStatus } from "../types/registration-status"
import { registrationStatusTransitions } from "../workflow/registration-status-transitions"

export type ValidateRegistrationStatusTransitionInput = {
  from: RegistrationStatus
  to: RegistrationStatus
}

export type RegistrationStatusTransitionValidationResult = {
  valid: boolean
  from: RegistrationStatus
  to: RegistrationStatus
  message: string
  allowedTo: RegistrationStatus[]
}

export function validateRegistrationStatusTransition(
  input: ValidateRegistrationStatusTransitionInput
): RegistrationStatusTransitionValidationResult {
  const rule = registrationStatusTransitions.find(
    (transition) => transition.from === input.from
  )

  const allowedTo = rule?.allowedTo ?? []
  const valid = allowedTo.includes(input.to)

  return {
    valid,
    from: input.from,
    to: input.to,
    message: valid
      ? "Status transition allowed"
      : `Status transition from ${input.from} to ${input.to} is not allowed`,
    allowedTo
  }
}
