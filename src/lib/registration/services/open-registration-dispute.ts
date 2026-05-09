import type {
  RegistrationDispute,
  RegistrationDisputeType
} from "../contracts/registration-dispute-contract"

import {
  createRegistrationAuditEvent
} from "../audit/create-registration-audit-event"

import type {
  RegistrationAuditEvent
} from "../contracts/registration-audit-contract"

export type OpenRegistrationDisputeInput = {
  disputeType: RegistrationDisputeType

  relatedEntityType: string
  relatedEntityId: string

  openedBy?: string

  description: string

  evidenceIds?: string[]
}

export type OpenRegistrationDisputeResult = {
  dispute: RegistrationDispute
  auditEvent: RegistrationAuditEvent
}

export function openRegistrationDispute(
  input: OpenRegistrationDisputeInput
): OpenRegistrationDisputeResult {

  const dispute: RegistrationDispute = {
    id: `dispute_${crypto.randomUUID()}`,

    disputeType: input.disputeType,
    disputeStatus: "open",

    relatedEntityType: input.relatedEntityType,
    relatedEntityId: input.relatedEntityId,

    openedBy: input.openedBy,

    description: input.description,

    evidenceIds: input.evidenceIds,

    affectsRegistrationStatus: true,
    resultingRegistrationStatus: "disputed",

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  const auditEvent = createRegistrationAuditEvent({
    eventType: "dispute.opened",

    entityType: input.relatedEntityType,
    entityId: input.relatedEntityId,

    performedBy: input.openedBy,

    reason: "Registration dispute opened",

    metadata: {
      disputeId: dispute.id,
      disputeType: dispute.disputeType
    }
  })

  return {
    dispute,
    auditEvent
  }
}
