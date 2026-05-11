import "dotenv/config"

import {
  claimNextRuntimeTask
} from "../lib/runtime/workers/claim-runtime-task"

import {
  failClaimedRuntimeTask
} from "../lib/runtime/workers/fail-runtime-task"

async function main() {
  const workerId = "worker-local-001"

  const task = await claimNextRuntimeTask(workerId)

  console.log("CLAIMED TASK")
  console.log(task)

  if (!task) {
    return
  }

  await failClaimedRuntimeTask(
    task.queue_id,
    workerId,
    "Forced failure test"
  )

  console.log("TASK FAILED")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
