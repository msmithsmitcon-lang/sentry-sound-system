import { SubmissionProcessingResult } from "../contracts/submission-processing-result.contract"
import { SubmissionQueueItem } from "../types/submission-queue-item.types"
import { calculateRetryDate } from "./calculate-retry-date"
import { canRetrySubmission } from "./can-retry-submission"

export function buildRetryResult(
  submission: SubmissionQueueItem,
  regulatorMessage?: string
): SubmissionProcessingResult {
  if (!canRetrySubmission(submission)) {
    return {
      success: false,
      nextStatus: "failed",
      retryable: false,
      regulatorMessage:
        regulatorMessage ?? "Submission retry limit reached.",
      blockingIssues: [
        "Submission cannot be retried under current retry governance.",
      ],
    }
  }

  return {
    success: false,
    nextStatus: "retry_pending",
    retryable: true,
    retryAt: calculateRetryDate(submission.retryCount),
    regulatorMessage:
      regulatorMessage ?? "Submission scheduled for retry.",
  }
}
