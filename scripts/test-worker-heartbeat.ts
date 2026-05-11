import "dotenv/config"

import { publishWorkerHeartbeat } from "../lib/runtime/health/worker-heartbeat"
import { getAllWorkers } from "../lib/runtime/registry/worker-registry"

async function main() {
  const heartbeat = await publishWorkerHeartbeat("worker-local-001", 0)

  console.log("HEARTBEAT")
  console.log(heartbeat)

  console.log("WORKERS")
  console.log(getAllWorkers())
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
