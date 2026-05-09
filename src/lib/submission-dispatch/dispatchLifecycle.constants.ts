import {
  SubmissionDispatchStatus
} from "./submissionDispatch.types"

export const ALLOWED_DISPATCH_TRANSITIONS:
  Record<SubmissionDispatchStatus, SubmissionDispatchStatus[]> = {

  queued: [
    "scheduled",
    "dispatching",
    "cancelled"
  ],

  scheduled: [
    "dispatching",
    "cancelled"
  ],

  dispatching: [
    "sent",
    "failed",
    "retrying"
  ],

  retrying: [
    "dispatching",
    "failed",
    "cancelled"
  ],

  failed: [
    "retrying",
    "cancelled"
  ],

  sent: [],

  cancelled: []
}
