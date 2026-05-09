export type EvidenceResolutionStatus =
  | "valid"
  | "superseded"
  | "rejected"
  | "pending"

export interface ResolvedEvidenceState {
  evidenceId: string

  status: EvidenceResolutionStatus

  supersededByEvidenceId?: string | null

  isLatestValidEvidence: boolean

  rejectionReason?: string | null
}
