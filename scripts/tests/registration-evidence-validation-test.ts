import { validateRegistrationEvidence } from "../../src/lib/registration/services/validate-registration-evidence"

const result = validateRegistrationEvidence({
  layer: "recording",
  uploadedEvidenceTypes: [
    "performer_declaration"
  ]
})

console.log("\n=== REGISTRATION EVIDENCE VALIDATION TEST ===\n")

console.log(JSON.stringify(result, null, 2))

if (result.valid !== false) {
  throw new Error("Expected evidence validation to fail")
}

if (result.blockers.length !== 1) {
  throw new Error("Expected 1 blocker")
}

console.log("\nEvidence validation test passed.\n")
