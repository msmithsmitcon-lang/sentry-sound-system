import { getPendingSubmissionQueueItems } from "../src/lib/registration/submission-engine/repositories/get-pending-submission-queue-items"

import { processSubmissionQueueService } from "../src/lib/registration/submission-engine/services/process-submission-queue.service"

import { submissionAdapterRegistry } from "../src/lib/registration/submission-engine/registry/default-submission-adapter.registry"

async function main() {
  const pending =
    await getPendingSubmissionQueueItems(10)

  console.log("Pending items:", pending.length)

  for (const item of pending) {
    const result =
      await processSubmissionQueueService(
        item,
        submissionAdapterRegistry
      )

    console.log(
      JSON.stringify(
        {
          itemId: item.id,
          result,
        },
        null,
        2
      )
    )
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
