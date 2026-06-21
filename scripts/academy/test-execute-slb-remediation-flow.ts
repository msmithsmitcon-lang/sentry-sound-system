import "dotenv/config"

import { executeSLBFlow }
from "../../src/lib/academy/runtime/orchestration/execute-slb-flow"

import { SLB_01_01 }
from "../../src/lib/academy/slbs/contracts/slb-01-01"

async function main() {
  const session =
    await executeSLBFlow(
      "FLOW_TEST_" + Date.now(),
      "22222222-2222-2222-2222-222222222222",
      SLB_01_01,
      { forceRemediation: true }
    )

  console.log(JSON.stringify({
    success: true,
    session,
  }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})


