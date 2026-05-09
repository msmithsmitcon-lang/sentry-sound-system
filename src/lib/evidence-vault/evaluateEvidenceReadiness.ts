import {
  EvidenceRequirementLevel,
  EvidenceType,
  EvidenceVerificationStatus
} from "@/contracts/evidence-vault/evidence.constants"

export interface EvidenceRecord {
  evidenceType: EvidenceType
  requirementLevel: EvidenceRequirementLevel
  verificationStatus: EvidenceVerificationStatus
}

export interface EvaluateEvidenceReadinessInput {
  evidence: EvidenceRecord[]
}

export interface EvaluateEvidenceReadinessResult {
  ready: boolean
  blockingEvidenceTypes: EvidenceType[]
  missingEvidenceTypes: EvidenceType[]
  rejectedEvidenceTypes: EvidenceType[]
  pendingReviewEvidenceTypes: EvidenceType[]
}
