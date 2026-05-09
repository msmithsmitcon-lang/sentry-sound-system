import type {
  RegistrationAuditEvent,
  RegistrationAuditEventType
} from "../contracts/registration-audit-contract"

export type CreateRegistrationAuditEventInput = {
  eventType: RegistrationAuditEventType

  entityType: string
  entityId: string

  performedBy?: string
  reason?: string

  oldValue?: Record<string, unknown>
  newValue?: Record<string, unknown>

  relatedEvidenceIds?: string[]

  metadata?: Record<string, unknown>
}

export function createRegistrationAuditEvent(
  input: CreateRegistrationAuditEventInput
): RegistrationAuditEvent {
  return {
    id: `registration_audit_${crypto.randomUUID()}`,
    eventType: input.eventType,
    entityType: input.entityType,
    entityId: input.entityId,
    performedBy: input.performedBy,
    reason: input.reason,
    oldValue: input.oldValue,
    newValue: input.newValue,
    relatedEvidenceIds: input.relatedEvidenceIds,
    metadata: input.metadata,
    createdAt: new Date().toISOString()
  }
}
