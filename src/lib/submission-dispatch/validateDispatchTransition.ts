import {
  SubmissionDispatchStatus
} from "./submissionDispatch.types"

import {
  ALLOWED_DISPATCH_TRANSITIONS
} from "./dispatchLifecycle.constants"

export interface ValidateDispatchTransitionInput {
  currentStatus: SubmissionDispatchStatus
  nextStatus: SubmissionDispatchStatus
}

export function validateDispatchTransition(
  input: ValidateDispatchTransitionInput
): boolean {

  const allowed =
    ALLOWED_DISPATCH_TRANSITIONS[
      input.currentStatus
    ]

  return allowed.includes(
    input.nextStatus
  )
}
