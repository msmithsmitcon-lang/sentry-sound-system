import {
  createMusicalWork,
  getMusicalWorkById
} from "../../src/lib/registration/repositories/musical-work-repository"

import {
  getAuditEventsForEntity
} from "../../src/lib/registration/repositories/registration-audit-repository"

import {
  evaluateAndPersistMusicalWorkReadiness
} from "../../src/lib/registration/services/evaluate-and-persist-musical-work-readiness"

async function main() {

  const work = await createMusicalWork({
    title: "Persisted Workflow Transaction Test",
    status: "draft",
    documented: true
  })

  const result =
    await evaluateAndPersistMusicalWorkReadiness({
      musicalWorkId: work.id,

      uploadedEvidenceTypes: [
        "split_sheet"
      ],

      performedBy: "workflow_test"
    })

  console.log("\n=== WORKFLOW RESULT ===\n")
  console.log(result)

  const updated =
    await getMusicalWorkById(work.id)

  console.log("\n=== UPDATED ENTITY ===\n")
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

  if (updated.readinessScore === null) {
    throw new Error("Expected persisted readiness score")
  }

  if (auditEvents.length === 0) {
    throw new Error("Expected persisted audit event")
  }

  console.log(
    "\nPersisted workflow transaction test passed.\n"
  )
}

main()
