import { evaluateRegistrationReadiness } from "../../src/lib/registration/services/evaluate-registration-readiness"
import { validateSubmissionGate } from "../../src/lib/registration/services/validate-submission-gate"

const readiness = evaluateRegistrationReadiness({
  subjectId: "work_001",
  subjectLayer: "composition",
  conditions: {
    composition_split_total_100: true,
    split_sheet_signed: true,
    work_documented: true
  },
  uploadedEvidenceTypes: [
    "split_sheet",
    "signed_composer_split_confirmation"
  ]
})

const allowedGate = validateSubmissionGate({
  currentStatus: "ready_for_submission",
  readiness
})

const blockedGate = validateSubmissionGate({
  currentStatus: "draft",
  readiness
})

console.log("\n=== REGISTRATION SUBMISSION GATE TEST ===\n")

console.log("Allowed gate:")
console.log(JSON.stringify(allowedGate, null, 2))

console.log("\nBlocked gate:")
console.log(JSON.stringify(blockedGate, null, 2))

if (allowedGate.allowed !== true) {
  throw new Error("Expected submission gate to allow ready_for_submission")
}

if (blockedGate.allowed !== false) {
  throw new Error("Expected submission gate to block draft status")
}

console.log("\nRegistration submission gate test passed.\n")
