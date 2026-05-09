export interface PersistSubmissionExportInput {
  regulator: string

  format: string

  payload:
    Record<string, unknown>

  manifestId?: string | null

  submissionQueueId?: string | null

  metadata?:
    Record<string, unknown> | null
}

export interface PersistedSubmissionExport {
  id: string

  regulator: string

  format: string

  payload:
    Record<string, unknown>

  manifestId?: string | null

  submissionQueueId?: string | null

  metadata?:
    Record<string, unknown> | null

  createdAt: Date
}
