export type RegistrationAuditEventType =
  | "registration.created"
  | "registration.updated"
  | "readiness.evaluated"
  | "evidence.uploaded"
  | "evidence.verified"
  | "evidence.rejected"
  | "split.updated"
  | "contributor.confirmed"
  | "performer.confirmed"
  | "submission.generated"
  | "submission.sent"
  | "registration.accepted"
  | "registration.rejected"
  | "amendment.requested"
  | "amendment.submitted"
  | "dispute.opened"
  | "dispute.resolved"

export type RegistrationAuditEvent = {
  id: string

  eventType: RegistrationAuditEventType

  entityType: string
  entityId: string

  performedBy?: string

  reason?: string

  oldValue?: Record<string, unknown>
  newValue?: Record<string, unknown>

  relatedEvidenceIds?: string[]

  metadata?: Record<string, unknown>

  createdAt: string
}
