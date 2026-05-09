import { SubmissionStatus } from "../contracts/submission-lifecycle.contract"

export interface SubmissionProcessingResult {
  success: boolean

  nextStatus: SubmissionStatus

  regulatorReference?: string | null

  regulatorMessage?: string | null

  retryable: boolean

  retryAt?: Date | null

  blockingIssues?: string[]

  warnings?: string[]

  auditReferenceId?: string | null

  metadata?: Record<string, unknown>
}
