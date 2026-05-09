import type { EvidenceType } from "../types/evidence-type"
import type { RegistrationLayer } from "../types/registration-layer"

export type EvidenceRequirementLevel =
  | "required"
  | "optional"
  | "conditional"

export type EvidenceVerificationStatus =
  | "pending"
  | "verified"
  | "rejected"
  | "superseded"

export type RegistrationEvidence = {
  id: string
  type: EvidenceType
  layer: RegistrationLayer

  title: string
  description?: string

  requirementLevel: EvidenceRequirementLevel

  uploadedBy?: string
  uploadedAt?: string

  verificationStatus: EvidenceVerificationStatus

  requiresSignature: boolean
  requiresVerification: boolean

  blocksSubmissionIfMissing: boolean

  expiryDate?: string
  supersededByEvidenceId?: string

  relatedEntityId?: string
  relatedSubmissionId?: string

  metadata?: Record<string, unknown>
}
