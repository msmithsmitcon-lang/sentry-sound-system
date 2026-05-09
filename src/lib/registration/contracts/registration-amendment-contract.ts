export type RegistrationAmendmentType =
  | "metadata_correction"
  | "split_adjustment"
  | "performer_addition"
  | "publisher_addition"
  | "ownership_change"
  | "isrc_correction"
  | "territory_update"

export type RegistrationAmendmentStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"

export type RegistrationAmendment = {
  id: string

  amendmentType: RegistrationAmendmentType
  amendmentStatus: RegistrationAmendmentStatus

  relatedEntityType: string
  relatedEntityId: string

  requestedBy?: string

  reason: string

  oldValues?: Record<string, unknown>
  newValues?: Record<string, unknown>

  evidenceIds?: string[]

  requiresReconfirmation: boolean

  createdAt: string
  updatedAt: string
}
