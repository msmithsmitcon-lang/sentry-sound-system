import {
  EvidenceVerificationStatus
} from "@/contracts/evidence-vault/evidence.constants"

export const ALLOWED_EVIDENCE_TRANSITIONS:
  Record<EvidenceVerificationStatus, EvidenceVerificationStatus[]> = {

  PENDING: [
    "UNDER_REVIEW",
    "REJECTED",
    "VERIFIED"
  ],

  UNDER_REVIEW: [
    "VERIFIED",
    "REJECTED",
    "SUPERSEDED"
  ],

  VERIFIED: [
    "SUPERSEDED",
    "EXPIRED"
  ],

  REJECTED: [
    "UNDER_REVIEW",
    "SUPERSEDED"
  ],

  SUPERSEDED: [],

  EXPIRED: [
    "UNDER_REVIEW",
    "SUPERSEDED"
  ]
}
