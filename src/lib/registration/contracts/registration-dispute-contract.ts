import type { RegistrationStatus } from "../types/registration-status"

export type RegistrationDisputeType =
  | "ownership_dispute"
  | "split_dispute"
  | "performer_dispute"
  | "publisher_dispute"
  | "isrc_conflict"
  | "duplicate_registration"
  | "territory_dispute"
  | "sample_clearance_dispute"

export type RegistrationDisputeStatus =
  | "open"
  | "under_review"
  | "resolved"
  | "rejected"
  | "withdrawn"

export type RegistrationDispute = {
  id: string

  disputeType: RegistrationDisputeType
  disputeStatus: RegistrationDisputeStatus

  relatedEntityType: string
  relatedEntityId: string

  openedBy?: string

  description: string

  evidenceIds?: string[]

  proposedResolution?: string

  affectsRegistrationStatus: boolean

  resultingRegistrationStatus?: RegistrationStatus

  createdAt: string
  updatedAt: string
}
