export interface SubmissionRegulatorResponse {
  regulator: string

  regulatorReference?: string | null

  status:
    | "accepted"
    | "rejected"
    | "amendment_required"
    | "undocumented"
    | "retry_pending"

  message?: string | null

  rawResponse?: unknown

  receivedAt: Date
}
