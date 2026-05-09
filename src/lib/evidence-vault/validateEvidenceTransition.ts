import {
  EvidenceVerificationStatus
} from "@/contracts/evidence-vault/evidence.constants"

import {
  ALLOWED_EVIDENCE_TRANSITIONS
} from "./evidenceLifecycle.constants"

export interface ValidateEvidenceTransitionInput {
  currentStatus: EvidenceVerificationStatus
  nextStatus: EvidenceVerificationStatus
}

export function validateEvidenceTransition(
  input: ValidateEvidenceTransitionInput
): boolean {

  const allowed =
    ALLOWED_EVIDENCE_TRANSITIONS[input.currentStatus]

  return allowed.includes(input.nextStatus)
}
