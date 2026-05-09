import { createSubmissionRemediationCase } from "../repositories/create-submission-remediation-case"

export async function createUndocumentedSubmissionCase(
  submissionQueueId: string
) {
  return createSubmissionRemediationCase({
    submissionQueueId,

    type:
      "undocumented",

    status:
      "open",

    reason:
      "Submission entered undocumented state and requires remediation before royalty eligibility.",

    requiredActions: [
      "Validate ownership splits.",
      "Verify contributor identities.",
      "Provide missing evidence documentation.",
      "Resolve metadata inconsistencies.",
    ],

    blocksRoyaltyEligibility:
      true,

    metadata: {
      escalationLevel:
        "cashflow_risk",
    },
  })
}
