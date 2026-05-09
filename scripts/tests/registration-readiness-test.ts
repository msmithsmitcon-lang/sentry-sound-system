import { evaluateRegistrationReadiness } from "../../src/lib/registration/services/evaluate-registration-readiness"

const result = evaluateRegistrationReadiness({
  subjectId: "work_001",
  subjectLayer: "recording",

  conditions: {
    performer_declarations_present: true,
    unique_isrc: true
  },

  uploadedEvidenceTypes: [
    "performer_declaration"
  ]
})

console.log("\n=== INTEGRATED REGISTRATION READINESS TEST ===\n")

console.log(JSON.stringify(result, null, 2))

if (result.ready !== false) {
  throw new Error("Expected readiness to be false")
}

const hasMasterOwnershipBlocker = result.blockers.some(
  (b) => b.ruleId === "evidence-master_ownership_agreement"
)

if (!hasMasterOwnershipBlocker) {
  throw new Error("Expected master ownership blocker")
}

console.log("\nIntegrated readiness orchestration test passed.\n")
