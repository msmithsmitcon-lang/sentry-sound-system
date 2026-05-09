import type { RegistrationStatus } from "../types/registration-status"

export type RegistrationStatusTransitionRule = {
  from: RegistrationStatus
  allowedTo: RegistrationStatus[]
}

export const registrationStatusTransitions: RegistrationStatusTransitionRule[] = [
  {
    from: "draft",
    allowedTo: [
      "metadata_incomplete",
      "evidence_pending",
      "undocumented"
    ]
  },

  {
    from: "metadata_incomplete",
    allowedTo: [
      "evidence_pending",
      "split_confirmation_pending",
      "ready_for_submission"
    ]
  },

  {
    from: "evidence_pending",
    allowedTo: [
      "split_confirmation_pending",
      "ready_for_submission"
    ]
  },

  {
    from: "split_confirmation_pending",
    allowedTo: [
      "ready_for_submission",
      "disputed"
    ]
  },

  {
    from: "performer_confirmation_pending",
    allowedTo: [
      "ready_for_submission",
      "disputed"
    ]
  },

  {
    from: "undocumented",
    allowedTo: [
      "metadata_incomplete",
      "evidence_pending"
    ]
  },

  {
    from: "ready_for_submission",
    allowedTo: [
      "submitted"
    ]
  },

  {
    from: "submitted",
    allowedTo: [
      "under_review",
      "rejected"
    ]
  },

  {
    from: "under_review",
    allowedTo: [
      "registered",
      "amendment_required",
      "rejected",
      "disputed"
    ]
  },

  {
    from: "registered",
    allowedTo: [
      "amendment_required",
      "superseded",
      "withdrawn",
      "disputed"
    ]
  },

  {
    from: "amendment_required",
    allowedTo: [
      "under_review",
      "submitted"
    ]
  },

  {
    from: "disputed",
    allowedTo: [
      "under_review",
      "withdrawn"
    ]
  }
]
