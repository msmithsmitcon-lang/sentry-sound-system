export type SubmissionLifecycleStatus =
  | "generated"
  | "queued"
  | "submitted"
  | "accepted"
  | "rejected"
  | "amended"
  | "resubmitted"

export type SubmissionLifecycleTransition = {
  fromStatus?: SubmissionLifecycleStatus

  toStatus:
    SubmissionLifecycleStatus

  changedBy?: string

  reason?: string

  regulatorReference?: string

  regulatorResponse?: unknown

  changedAt: string
}
