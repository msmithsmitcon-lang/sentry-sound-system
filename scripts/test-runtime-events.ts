import "dotenv/config"

import {
  logRuntimeInfo,
  logRuntimeWarning,
  logRuntimeError
} from "../lib/runtime/events/runtime-event-logger"

async function main() {
  await logRuntimeInfo(
    "WORKER_STARTED",
    "Worker runtime initialized",
    "worker-local-001"
  )

  await logRuntimeWarning(
    "QUEUE_DELAY",
    "Queue latency exceeded threshold",
    "worker-local-001"
  )

  await logRuntimeError(
    "TASK_FAILURE",
    "Task execution failed",
    "worker-local-001"
  )

  console.log("EVENTS LOGGED")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
