import { createSubmissionQueueItem } from "../repositories/create-submission-queue-item"

import { processSubmissionQueueService } from "../services/process-submission-queue.service"

import { submissionAdapterRegistry } from "../registry/default-submission-adapter.registry"

export async function runSubmissionEngineTest() {
  const queueItem =
    await createSubmissionQueueItem({
      target: "SAMRO",

      status: "queued",

      priority: "normal",

      entityType: "musical_work",

      entityId: "TEST-WORK-001",

      exportFormat: "CSV",

      fingerprint:
        "TEST-FINGERPRINT-001",
    })

  const result =
    await processSubmissionQueueService(
      queueItem,
      submissionAdapterRegistry
    )

  console.log(
    "Submission Engine Test Result:",
    result
  )

  return result
}
