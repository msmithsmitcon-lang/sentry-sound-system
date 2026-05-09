export interface CreateEvidenceAuditEventInput {
  evidenceId: string

  eventType: string

  actorUserId?: string | null

  relatedEntityType?: string | null
  relatedEntityId?: string | null

  previousState?: Record<string, unknown> | null
  nextState?: Record<string, unknown> | null

  metadata?: Record<string, unknown> | null
}
