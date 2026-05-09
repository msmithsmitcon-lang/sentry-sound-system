import { SubmissionQueueItem } from "../types/submission-queue-item.types"
import { SubmissionProcessingResult } from "../contracts/submission-processing-result.contract"

export interface SubmissionRegulatorAdapter {
  validate(
    submission: SubmissionQueueItem
  ): Promise<SubmissionProcessingResult>

  package(
    submission: SubmissionQueueItem
  ): Promise<SubmissionProcessingResult>

  submit(
    submission: SubmissionQueueItem
  ): Promise<SubmissionProcessingResult>

  retry(
    submission: SubmissionQueueItem
  ): Promise<SubmissionProcessingResult>
}
