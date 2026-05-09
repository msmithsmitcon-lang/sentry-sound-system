import {
  EvidenceType,
  EvidenceRequirementLevel
} from "@/contracts/evidence-vault/evidence.constants"

export interface CreateEvidenceRecordInput {
  evidenceType: EvidenceType

  relatedEntityType: string
  relatedEntityId: string

  requirementLevel: EvidenceRequirementLevel

  uploadedByUserId?: string | null

  fileName?: string | null
  mimeType?: string | null
  storageKey?: string | null

  metadata?: Record<string, unknown> | null
}
