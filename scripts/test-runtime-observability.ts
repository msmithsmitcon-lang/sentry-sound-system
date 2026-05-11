import "dotenv/config"

import { publishWorkerHeartbeat } from "../lib/runtime/health/worker-heartbeat"

import {
  recordTaskCompletion,
  recordTaskFailure,
  updateQueueDepth,
  getRuntimeMetrics
} from "../lib/runtime/metrics/runtime-metrics"

import {
  getAllWorkers
} from "../lib/runtime/registry/worker-registry"

async function main() {
  await publishWorkerHeartbeat(
    "worker-local-001",
    1
  )

  await recordTaskCompletion(250)

  await recordTaskCompletion(750)

  await recordTaskFailure()

  await updateQueueDepth(3)

  console.log("WORKERS")
  console.log(getAllWorkers())

  console.log("METRICS")
  console.log(getRuntimeMetrics())
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
