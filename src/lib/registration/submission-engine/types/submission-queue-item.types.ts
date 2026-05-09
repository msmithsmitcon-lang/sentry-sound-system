import {
  SubmissionPriority,
  SubmissionStatus,
  SubmissionTarget,
} from "../contracts/submission-lifecycle.contract"

export interface SubmissionQueueItem {
  id: string

  workspaceId: string

  target: SubmissionTarget

  status: SubmissionStatus

  priority: SubmissionPriority

  entityType: string

  entityId: string

  exportFormat: string

  fingerprint: string

  version: number

  retryCount: number

  maxRetries: number

  regulatorReference?: string | null

  scheduledAt?: Date | null

  submittedAt?: Date | null

  acceptedAt?: Date | null

  rejectedAt?: Date | null

  failedAt?: Date | null

  expiresAt?: Date | null

  blockingIssues: string[]

  metadata: Record<string, unknown>

  createdAt: Date

  updatedAt: Date
}
