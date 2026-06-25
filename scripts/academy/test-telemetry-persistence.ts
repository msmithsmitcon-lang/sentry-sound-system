import "dotenv/config"

import { SupabaseTelemetryRepository } from "../../src/lib/academy/runtime/repositories/supabase/supabase-telemetry-repository"
import { createTelemetryEvent } from "../../src/lib/academy/runtime/telemetry/create-telemetry-event"

async function main() {
  const repo = new SupabaseTelemetryRepository()

  const event = createTelemetryEvent({
    eventId: crypto.randomUUID(),
    learnerId: "22222222-2222-2222-2222-222222222222",
    slbId: "SLB-01.01",
    sessionId: "SESSION_TEST_" + Date.now(),
    eventType: "competency_progressed",
    runtimeState: "testing",
    metadata: {
      source: "code-test",
      purpose: "validate academy telemetry persistence through existing runtime_telemetry_events",
    },
  })

  const saved = await repo.create(event)

  console.log(JSON.stringify({
    success: true,
    saved,
  }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

