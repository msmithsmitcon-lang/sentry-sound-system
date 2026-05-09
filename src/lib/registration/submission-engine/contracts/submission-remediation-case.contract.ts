export type SubmissionRemediationType =
  | "amendment_required"
  | "undocumented"
  | "evidence_required"
  | "metadata_correction_required"
  | "ownership_correction_required"

export type SubmissionRemediationStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "closed"
  | "blocked"

export interface SubmissionRemediationCase {
  submissionQueueId: string

  type: SubmissionRemediationType

  status: SubmissionRemediationStatus

  reason: string

  requiredActions: string[]

  blocksRoyaltyEligibility: boolean

  dueAt?: Date | null

  metadata?: Record<string, unknown>
}
