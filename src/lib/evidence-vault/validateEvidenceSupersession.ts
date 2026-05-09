import {
  ValidateEvidenceSupersessionInput,
  ValidateEvidenceSupersessionResult
} from "./validateEvidenceSupersession.types"

export function validateEvidenceSupersession(
  input: ValidateEvidenceSupersessionInput
): ValidateEvidenceSupersessionResult {

  if (
    input.existingEvidenceId ===
    input.replacementEvidenceId
  ) {
    return {
      valid: false,
      reason: "SELF_SUPERSESSION_NOT_ALLOWED"
    }
  }

  if (
    input.replacementVerificationStatus ===
    "REJECTED"
  ) {
    return {
      valid: false,
      reason: "REJECTED_EVIDENCE_CANNOT_SUPERSEDE"
    }
  }

  return {
    valid: true
  }
}
