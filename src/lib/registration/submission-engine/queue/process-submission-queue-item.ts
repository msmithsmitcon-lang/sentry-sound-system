import { SubmissionQueueItem } from "../types/submission-queue-item.types"
import {
  resolveSubmissionAdapter,
  SubmissionAdapterRegistry,
} from "../registry/submission-adapter.registry"

export async function processSubmissionQueueItem(
  submission: SubmissionQueueItem,
  registry: SubmissionAdapterRegistry
) {
  const adapter = resolveSubmissionAdapter(
    registry,
    submission.target
  )

  const validationResult =
    await adapter.validate(submission)

  if (!validationResult.success) {
    return validationResult
  }

  const packagingResult =
    await adapter.package(submission)

  if (!packagingResult.success) {
    return packagingResult
  }

  const submissionResult =
    await adapter.submit(submission)

  return submissionResult
}
