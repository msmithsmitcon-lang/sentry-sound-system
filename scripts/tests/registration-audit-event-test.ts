import {
  createRegistrationAuditEvent
} from "../../src/lib/registration/audit/create-registration-audit-event"

const event = createRegistrationAuditEvent({
  eventType: "readiness.evaluated",

  entityType: "musical_work",
  entityId: "work_001",

  performedBy: "system",

  reason: "Automatic readiness evaluation",

  metadata: {
    readinessScore: 100,
    blockers: 0
  }
})

console.log("\n=== REGISTRATION AUDIT EVENT TEST ===\n")

console.log(JSON.stringify(event, null, 2))

if (event.eventType !== "readiness.evaluated") {
  throw new Error("Expected readiness.evaluated event type")
}

if (event.entityId !== "work_001") {
  throw new Error("Expected entity ID work_001")
}

console.log("\nRegistration audit event test passed.\n")
