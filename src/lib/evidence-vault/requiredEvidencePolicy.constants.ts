import {
  EvidenceRequirementLevel,
  EvidenceType
} from "@/contracts/evidence-vault/evidence.constants"

export interface RequiredEvidencePolicyRule {
  entityType: string
  evidenceType: EvidenceType
  requirementLevel: EvidenceRequirementLevel
}

export const REQUIRED_EVIDENCE_POLICY_RULES:
  RequiredEvidencePolicyRule[] = [

  {
    entityType: "WORK",
    evidenceType: "SPLIT_CONFIRMATION",
    requirementLevel: "BLOCKING"
  },

  {
    entityType: "WORK",
    evidenceType: "DEED_OF_ASSIGNMENT",
    requirementLevel: "REQUIRED"
  },

  {
    entityType: "RELEASE",
    evidenceType: "DISTRIBUTION_CONFIRMATION",
    requirementLevel: "REQUIRED"
  },

  {
    entityType: "CONTRIBUTOR",
    evidenceType: "ID_DOCUMENT",
    requirementLevel: "BLOCKING"
  }
]
