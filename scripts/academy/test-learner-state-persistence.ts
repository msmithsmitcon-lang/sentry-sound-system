import "dotenv/config"

import { SupabaseLearnerStateRepository } from "../../src/lib/academy/runtime/repositories/supabase/supabase-learner-state-repository"

async function main() {
  const repo = new SupabaseLearnerStateRepository()

  const saved = await repo.createOrUpdate({
    learnerId: "22222222-2222-2222-2222-222222222222",
    programmeId: "PROGRAMME-01",
    moduleId: "MODULE-01",
    slbId: "SLB-01.01",
    competencyState: "competency_achieved",
    remediationHistory: [],
    completedStates: ["orientation", "diagnostic"],
    telemetrySummary: {
      misconceptionsDetected: 0,
      remediationCount: 0,
      retryCount: 0,
    },
    updatedAt: new Date().toISOString(),
  })

  console.log(JSON.stringify({
    success: true,
    saved,
  }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
