import {
  evaluateRecordingReadiness
} from "../../src/lib/registration/services/evaluate-recording-readiness"

const result = evaluateRecordingReadiness({
  performedBy: "system_test",

  recording: {
    id: "recording_001",
    title: "Test Recording",
    isrc: "ZAXXX2600001",
    status: "draft",

    masterOwnerId: "owner_001",
    masterOwnerName: "Test Label",

    documented: true,
    disputed: false,
    amendmentRequired: false,

    performers: [
      {
        performerId: "performer_001",
        performerName: "Artist One",
        role: "featured_artist",
        confirmed: true
      }
    ],

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  uploadedEvidenceTypes: [
    "performer_declaration",
    "master_ownership_agreement"
  ]
})

console.log("\n=== RECORDING READINESS + AUDIT TEST ===\n")
console.log(JSON.stringify(result, null, 2))

if (result.readiness.ready !== true) {
  throw new Error("Expected recording readiness to pass")
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

console.log("\nRecording readiness + audit test passed.\n")
