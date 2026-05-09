import { SubmissionQueueItem } from "../types/submission-queue-item.types"

export function canRetrySubmission(
  submission: SubmissionQueueItem
): boolean {
  if (submission.retryCount >= submission.maxRetries) {
    return false
  }

  if (
    submission.status === "accepted" ||
    submission.status === "expired" ||
    submission.status === "blocked"
  ) {
    return false
  }

  return true
}
