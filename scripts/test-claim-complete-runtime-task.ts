import "dotenv/config"

import {
  claimNextRuntimeTask
} from "../lib/runtime/workers/claim-runtime-task"

import {
  completeClaimedRuntimeTask
} from "../lib/runtime/workers/complete-runtime-task"

async function main() {
  const workerId = "worker-local-001"

  const task = await claimNextRuntimeTask(workerId)

  console.log("CLAIMED TASK")
  console.log(task)

  if (!task) {
    return
  }

  await completeClaimedRuntimeTask(
    task.queue_id,
    workerId
  )

  console.log("TASK COMPLETED")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
