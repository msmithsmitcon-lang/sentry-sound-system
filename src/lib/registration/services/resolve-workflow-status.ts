import type {
  WorkflowStatusResolutionInput,
  WorkflowStatusResolutionResult
} from "../contracts/workflow-status-resolution-contract"

export function resolveWorkflowStatus(
  input: WorkflowStatusResolutionInput
): WorkflowStatusResolutionResult {

  const reasons: string[] = []

  let resolvedStatus = "draft"

  let allowedForSubmission = false

  if (input.readiness.ready) {

    resolvedStatus =
      "ready_for_submission"

    allowedForSubmission = true

    reasons.push(
      "Readiness evaluation passed"
    )
  }
  else if (
    input.readiness.blockers.length > 0
  ) {

    resolvedStatus =
      "metadata_incomplete"

    reasons.push(
      "Blocking readiness rules failed"
    )
  }
  else {

    resolvedStatus =
      "evidence_pending"

    reasons.push(
      "Additional evidence required"
    )
  }

  return {
    resolvedStatus,
    allowedForSubmission,
    reasons
  }
}
