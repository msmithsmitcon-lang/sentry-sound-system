import "dotenv/config"

import { SupabaseEvidenceRepository }
from "../../src/lib/academy/runtime/repositories/supabase/supabase-evidence-repository"

async function main() {
  const repo =
    new SupabaseEvidenceRepository()

  const saved =
    await repo.create({
      evidenceId:
        crypto.randomUUID(),

      learnerId:
        "22222222-2222-2222-2222-222222222222",

      programmeId:
        "PROG-01",

      moduleId:
        "MOD-01",

      slbId:
        "SLB-01.01",

      evidenceType:
        "competency_validation",

      competencyTarget:
        "Music Rights Ownership Fundamentals",

      passed:
        true,

      submittedAt:
        new Date().toISOString(),

      metadata: {
        source:
          "runtime-evidence-test",
      },
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
