import {
  evaluateMusicalWorkReadiness
} from "../../src/lib/registration/services/evaluate-musical-work-readiness"

const result = evaluateMusicalWorkReadiness({
  performedBy: "system_test",

  work: {
    id: "work_001",
    title: "Test Composition",
    status: "draft",

    documented: true,
    disputed: false,
    amendmentRequired: false,

    totalOwnershipPercentage: 100,

    contributors: [
      {
        contributorId: "contributor_001",
        contributorName: "Composer One",
        role: "composer",
        ownershipPercentage: 50,
        confirmed: true
      },
      {
        contributorId: "contributor_002",
        contributorName: "Composer Two",
        role: "lyricist",
        ownershipPercentage: 50,
        confirmed: true
      }
    ],

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  uploadedEvidenceTypes: [
    "split_sheet",
    "signed_composer_split_confirmation"
  ]
})

console.log("\n=== MUSICAL WORK READINESS + AUDIT TEST ===\n")
console.log(JSON.stringify(result, null, 2))

if (result.readiness.ready !== true) {
  throw new Error("Expected musical work readiness to pass")
}

if (result.readiness.blockers.length !== 0) {
  throw new Error("Expected zero blockers")
}

if (result.auditEvent.eventType !== "readiness.evaluated") {
  throw new Error("Expected readiness.evaluated audit event")
}

if (result.auditEvent.performedBy !== "system_test") {
  throw new Error("Expected performedBy system_test")
}

console.log("\nMusical work readiness + audit test passed.\n")
