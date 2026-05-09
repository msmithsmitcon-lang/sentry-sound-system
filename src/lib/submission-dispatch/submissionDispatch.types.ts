export type SubmissionDispatchStatus =
  | "queued"
  | "scheduled"
  | "dispatching"
  | "sent"
  | "failed"
  | "retrying"
  | "cancelled"

export interface CreateSubmissionDispatchInput {
  submissionExportId: string

  regulator: string

  status?: SubmissionDispatchStatus

  scheduledAt?: string | null

  metadata?:
    Record<string, unknown> | null
}

export interface SubmissionDispatchRecord {
  id: string

  submissionExportId: string

  regulator: string

  status: SubmissionDispatchStatus

  retryCount: number

  maxRetries: number

  scheduledAt?: Date | null

  dispatchedAt?: Date | null

  failedAt?: Date | null

  metadata?:
    Record<string, unknown> | null

  createdAt: Date
  updatedAt: Date
}
