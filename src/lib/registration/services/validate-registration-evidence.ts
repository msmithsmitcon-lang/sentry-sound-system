import { registrationEvidenceRegistry } from "../evidence/registration-evidence-registry"
import type { RegistrationLayer } from "../types/registration-layer"
import type { EvidenceType } from "../types/evidence-type"

export type ValidateEvidenceInput = {
  layer: RegistrationLayer
  uploadedEvidenceTypes: EvidenceType[]
}

export type EvidenceValidationIssue = {
  evidenceType: EvidenceType
  severity: "blocker" | "warning"
  message: string
}

export type EvidenceValidationResult = {
  valid: boolean
  blockers: EvidenceValidationIssue[]
  warnings: EvidenceValidationIssue[]
}

export function validateRegistrationEvidence(
  input: ValidateEvidenceInput
): EvidenceValidationResult {
  const relevantEvidence = registrationEvidenceRegistry.filter(
    (evidence) => evidence.layer === input.layer
  )

  const blockers: EvidenceValidationIssue[] = []
  const warnings: EvidenceValidationIssue[] = []

  for (const evidence of relevantEvidence) {
    const uploaded = input.uploadedEvidenceTypes.includes(evidence.type)

    if (!uploaded) {
      if (evidence.blocksSubmissionIfMissing) {
        blockers.push({
          evidenceType: evidence.type,
          severity: "blocker",
          message: `${evidence.title} is required`
        })
      } else if (evidence.requirementLevel === "conditional") {
        warnings.push({
          evidenceType: evidence.type,
          severity: "warning",
          message: `${evidence.title} may be required depending on workflow`
        })
      }
    }
  }

  return {
    valid: blockers.length === 0,
    blockers,
    warnings
  }
}
