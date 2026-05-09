export interface EvidenceReadinessResult {
  ready: boolean
  blockingEvidenceTypes: string[]
  missingEvidenceTypes: string[]
  rejectedEvidenceTypes: string[]
  pendingReviewEvidenceTypes: string[]
}
