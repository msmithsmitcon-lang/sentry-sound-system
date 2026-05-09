import { processSubmissionQueueItem } from "../queue/process-submission-queue-item"

import { updateSubmissionQueueStatus } from "../repositories/update-submission-queue-status"

import { createSubmissionQueueEvent } from "../repositories/create-submission-queue-event"

import { SubmissionAdapterRegistry } from "../registry/submission-adapter.registry"

import { SubmissionQueueItem } from "../types/submission-queue-item.types"

export async function processSubmissionQueueService(
  submission: SubmissionQueueItem,
  registry: SubmissionAdapterRegistry
) {
  const oldStatus =
    submission.status

  await updateSubmissionQueueStatus(
    submission.id,
    "validating"
  )

  const result =
    await processSubmissionQueueItem(
      submission,
      registry
    )

  await updateSubmissionQueueStatus(
    submission.id,
    result.nextStatus,
    result.metadata
  )

  await createSubmissionQueueEvent({
    submissionQueueId:
      submission.id,

    eventType:
      "submission.processed",

    oldStatus,

    newStatus:
      result.nextStatus,

    message:
      result.regulatorMessage,

    metadata:
      result.metadata,
  })

  return result
}
