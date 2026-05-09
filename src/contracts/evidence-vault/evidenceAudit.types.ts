import {
  EvidenceAuditEventType
} from "./evidenceAudit.constants"

export interface EvidenceAuditEvent {
  eventType: EvidenceAuditEventType

  evidenceId: string

  actorUserId?: string | null

  relatedEntityType?: string | null
  relatedEntityId?: string | null

  previousState?: Record<string, unknown> | null
  nextState?: Record<string, unknown> | null

  metadata?: Record<string, unknown> | null

  occurredAt: Date
}
