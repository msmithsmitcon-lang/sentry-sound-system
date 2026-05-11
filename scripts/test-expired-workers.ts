import "dotenv/config"

import {
  getExpiredWorkers
} from "../lib/runtime/workers/expired-workers"

async function main() {
  const workers = await getExpiredWorkers()

  console.log("EXPIRED WORKERS")
  console.log(workers)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
