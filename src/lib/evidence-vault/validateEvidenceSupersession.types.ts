export interface ValidateEvidenceSupersessionInput {
  existingEvidenceId: string
  replacementEvidenceId: string
  existingVerificationStatus: string
  replacementVerificationStatus: string
}

export interface ValidateEvidenceSupersessionResult {
  valid: boolean
  reason?: string
}
