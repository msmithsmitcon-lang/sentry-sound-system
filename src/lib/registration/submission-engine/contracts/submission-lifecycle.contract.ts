export const SUBMISSION_STATUSES = [
  "generated",
  "queued",
  "validating",
  "validated",
  "packaged",
  "submitted",
  "accepted",
  "rejected",
  "amended",
  "resubmitted",
  "failed",
  "retry_pending",
  "expired",
  "blocked",
] as const

export type SubmissionStatus =
  (typeof SUBMISSION_STATUSES)[number]

export const SUBMISSION_TARGETS = [
  "SAMRO",
  "CAPASSO",
  "SAMPRA",
  "RAV",
  "DDEX",
  "CWR",
  "VERICAST",
] as const

export type SubmissionTarget =
  (typeof SUBMISSION_TARGETS)[number]

export const SUBMISSION_PRIORITIES = [
  "low",
  "normal",
  "high",
  "critical",
] as const

export type SubmissionPriority =
  (typeof SUBMISSION_PRIORITIES)[number]
