import {
  createMusicalWork,
  getMusicalWorkById
} from "../../src/lib/registration/repositories/musical-work-repository"

import {
  getAuditEventsForEntity
} from "../../src/lib/registration/repositories/registration-audit-repository"

import {
  resolveAndPersistMusicalWorkStatus
} from "../../src/lib/registration/services/resolve-and-persist-musical-work-status"

async function main() {

  const work = await createMusicalWork({
    title: "Automatic Status Resolution Test",
    status: "draft",
    documented: true
  })

  await resolveAndPersistMusicalWorkStatus({
    musicalWorkId: work.id,

    readiness: {
      subjectId: work.id,
      subjectLayer: "composition",

      ready: false,

      score: 45,

      blockers: [
        {
          ruleId: "split_sheet_missing",
          passed: false,
          severity: "blocker",
          message: "Split sheet missing"
        }
      ],

      warnings: [],
      info: [],

      checkedAt: new Date().toISOString()
    },

    performedBy: "workflow_engine"
  })

  const updated =
    await getMusicalWorkById(work.id)

  console.log("\n=== UPDATED WORK ===\n")
  console.log(updated)

  const auditEvents =
    await getAuditEventsForEntity({
      entityType: "musical_work",
      entityId: work.id
    })

  console.log("\n=== AUDIT EVENTS ===\n")
  console.log(auditEvents)

  if (!updated) {
    throw new Error("Expected updated work")
  }

  if (updated.status !== "metadata_incomplete") {
    throw new Error(
      "Expected metadata_incomplete status"
    )
  }

  console.log(
    "\nAutomatic workflow status resolution test passed.\n"
  )
}

main()
