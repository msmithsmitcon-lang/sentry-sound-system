import { prisma } from "@/lib/db/prisma"

import {
  executeDispatch
} from "./executeDispatch"

import {
  ProcessDispatchQueueInput,
  ProcessDispatchQueueResult
} from "./processDispatchQueue.types"

export async function processDispatchQueue(
  input: ProcessDispatchQueueInput = {}
): Promise<ProcessDispatchQueueResult> {

  const limit =
    input.limit ?? 10

  const queued =
    await prisma.submissionDispatchQueue
      .findMany({
        where: {
          status: "queued"
        },

        orderBy: {
          createdAt: "asc"
        },

        take: limit
      })

  let processed = 0
  let sent = 0
  let failed = 0
  let skipped = 0

  for (const dispatch of queued) {

    try {

      await executeDispatch({
        dispatchId:
          dispatch.id
      })

      processed += 1
      sent += 1
    }

    catch {

      processed += 1
      failed += 1
    }
  }

  return {
    processed,
    sent,
    failed,
    skipped,

    processedAt:
      new Date().toISOString()
  }
}
