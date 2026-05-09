export interface EvidenceSnapshotItem {
  evidenceId: string

  documentType: string

  verificationStatus?: string | null

  supersededByEvidenceId?: string | null

  rejectionReason?: string | null
}

export interface ResolvedEvidenceSnapshot {
  validEvidenceIds: string[]

  supersededEvidenceIds: string[]

  rejectedEvidenceIds: string[]

  pendingEvidenceIds: string[]
}
