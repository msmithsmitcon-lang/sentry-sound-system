import {
  requestRegistrationAmendment
} from "../../src/lib/registration/services/request-registration-amendment"

const result = requestRegistrationAmendment({
  amendmentType: "split_adjustment",

  relatedEntityType: "musical_work",
  relatedEntityId: "work_001",

  requestedBy: "publisher_admin",

  reason: "Composer ownership percentages updated",

  oldValues: {
    composerA: 50,
    composerB: 50
  },

  newValues: {
    composerA: 60,
    composerB: 40
  },

  evidenceIds: [
    "split_sheet_002"
  ]
})

console.log("\n=== REGISTRATION AMENDMENT TEST ===\n")

console.log(JSON.stringify(result, null, 2))

if (result.amendment.amendmentStatus !== "draft") {
  throw new Error("Expected amendment status draft")
}

if (result.amendment.requiresReconfirmation !== true) {
  throw new Error("Expected reconfirmation requirement")
}

if (result.auditEvent.eventType !== "amendment.requested") {
  throw new Error("Expected amendment.requested audit event")
}

console.log("\nRegistration amendment test passed.\n")
