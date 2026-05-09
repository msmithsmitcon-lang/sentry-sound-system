import {
  createMusicalWork,
  getMusicalWorkById
} from "../../src/lib/registration/repositories/musical-work-repository"

import {
  getAuditEventsForEntity
} from "../../src/lib/registration/repositories/registration-audit-repository"

import {
  runMusicalWorkComplianceWorkflow
} from "../../src/lib/registration/services/run-musical-work-compliance-workflow"

async function main() {

  const work = await createMusicalWork({
    title: "Unified Compliance Workflow Test",
    status: "draft",
    documented: true
  })

  const result =
    await runMusicalWorkComplianceWorkflow({
      musicalWorkId: work.id,

      uploadedEvidenceTypes: [
        "split_sheet"
      ],

      performedBy: "compliance_engine"
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

  if (auditEvents.length < 2) {
    throw new Error(
      "Expected readiness + workflow audit events"
    )
  }

  console.log(
    "\nUnified compliance workflow test passed.\n"
  )
}

main()
