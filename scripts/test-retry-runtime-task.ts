import "dotenv/config"

import {
  claimNextRuntimeTask
} from "../lib/runtime/workers/claim-runtime-task"

import {
  retryClaimedRuntimeTask
} from "../lib/runtime/workers/retry-runtime-task"

async function main() {
  const workerId = "worker-local-001"

  const task = await claimNextRuntimeTask(workerId)

  console.log("CLAIMED TASK")
  console.log(task)

  if (!task) {
    return
  }

  await retryClaimedRuntimeTask(
    task.queue_id,
    workerId,
    "Retry requested",
    30
  )

  console.log("TASK RETRIED")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
