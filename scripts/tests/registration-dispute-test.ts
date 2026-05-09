import {
  openRegistrationDispute
} from "../../src/lib/registration/services/open-registration-dispute"

const result = openRegistrationDispute({
  disputeType: "ownership_dispute",

  relatedEntityType: "musical_work",
  relatedEntityId: "work_001",

  openedBy: "legal_reviewer",

  description: "Contributor ownership percentages disputed",

  evidenceIds: [
    "evidence_split_sheet_001"
  ]
})

console.log("\n=== REGISTRATION DISPUTE TEST ===\n")

console.log(JSON.stringify(result, null, 2))

if (result.dispute.disputeStatus !== "open") {
  throw new Error("Expected dispute status open")
}

if (result.dispute.resultingRegistrationStatus !== "disputed") {
  throw new Error("Expected resulting registration status disputed")
}

if (result.auditEvent.eventType !== "dispute.opened") {
  throw new Error("Expected dispute.opened audit event")
}

console.log("\nRegistration dispute test passed.\n")
