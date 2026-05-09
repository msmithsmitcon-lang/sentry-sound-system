import type {
  RegistrationAmendment,
  RegistrationAmendmentType
} from "../contracts/registration-amendment-contract"

import {
  createRegistrationAuditEvent
} from "../audit/create-registration-audit-event"

import type {
  RegistrationAuditEvent
} from "../contracts/registration-audit-contract"

export type RequestRegistrationAmendmentInput = {
  amendmentType: RegistrationAmendmentType

  relatedEntityType: string
  relatedEntityId: string

  requestedBy?: string

  reason: string

  oldValues?: Record<string, unknown>
  newValues?: Record<string, unknown>

  evidenceIds?: string[]
}

export type RequestRegistrationAmendmentResult = {
  amendment: RegistrationAmendment
  auditEvent: RegistrationAuditEvent
}

const amendmentTypesRequiringReconfirmation: RegistrationAmendmentType[] = [
  "split_adjustment",
  "performer_addition",
  "publisher_addition",
  "ownership_change"
]

export function requestRegistrationAmendment(
  input: RequestRegistrationAmendmentInput
): RequestRegistrationAmendmentResult {
  const requiresReconfirmation =
    amendmentTypesRequiringReconfirmation.includes(input.amendmentType)

  const amendment: RegistrationAmendment = {
    id: `amendment_${crypto.randomUUID()}`,

    amendmentType: input.amendmentType,
    amendmentStatus: "draft",

    relatedEntityType: input.relatedEntityType,
    relatedEntityId: input.relatedEntityId,

    requestedBy: input.requestedBy,

    reason: input.reason,

    oldValues: input.oldValues,
    newValues: input.newValues,

    evidenceIds: input.evidenceIds,

    requiresReconfirmation,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  const auditEvent = createRegistrationAuditEvent({
    eventType: "amendment.requested",

    entityType: input.relatedEntityType,
    entityId: input.relatedEntityId,

    performedBy: input.requestedBy,

    reason: input.reason,

    oldValue: input.oldValues,
    newValue: input.newValues,

    relatedEvidenceIds: input.evidenceIds,

    metadata: {
      amendmentId: amendment.id,
      amendmentType: amendment.amendmentType,
      requiresReconfirmation
    }
  })

  return {
    amendment,
    auditEvent
  }
}
