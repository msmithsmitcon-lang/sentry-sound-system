import {
  createMusicalWork
} from "../../src/lib/registration/repositories/musical-work-repository"

import {
  createRegistrationAuditEventRecord,
  getAuditEventsForEntity
} from "../../src/lib/registration/repositories/registration-audit-repository"

async function main() {

  const work = await createMusicalWork({
    title: "Audit Persistence Test",
    status: "draft",
    documented: true
  })

  await createRegistrationAuditEventRecord({
    eventType: "readiness.evaluated",

    entityType: "musical_work",
    entityId: work.id,

    performedBy: "system_test",

    reason: "Automatic readiness evaluation",

    metadata: {
      readinessScore: 88,
      blockers: 1
    },

    musicalWorkId: work.id
  })

  const events = await getAuditEventsForEntity({
    entityType: "musical_work",
    entityId: work.id
  })

  console.log("\n=== AUDIT EVENTS ===\n")
  console.log(events)

  if (events.length !== 1) {
    throw new Error("Expected one audit event")
  }

  if (events[0].eventType !== "readiness.evaluated") {
    throw new Error("Unexpected event type")
  }

  console.log("\nAudit persistence test passed.\n")
}

main()
