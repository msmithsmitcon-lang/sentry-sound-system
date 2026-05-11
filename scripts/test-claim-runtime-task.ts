import "dotenv/config"

import {
  claimNextRuntimeTask
} from "../lib/runtime/workers/claim-runtime-task"

async function main() {
  const task = await claimNextRuntimeTask(
    "worker-local-001"
  )

  console.log("CLAIMED TASK")
  console.log(task)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
