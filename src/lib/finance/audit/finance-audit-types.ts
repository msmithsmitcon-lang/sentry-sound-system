export type FinanceAuditEventType =
  | "transaction.created"
  | "transaction.updated"
  | "transaction.reconciled"
  | "transaction.voided"
  | "approval.created"
  | "approval.decided"

export type CreateFinanceAuditEventInput = {
  eventType: FinanceAuditEventType
  entityType: string
  entityId: string
  actorId: string
  workspaceId: string
  before?: unknown
  after?: unknown
  metadata?: Record<string, unknown>
}

export type FinanceAuditEvent = {
  id: string
  eventType: FinanceAuditEventType
  entityType: string
  entityId: string
  actorId: string
  workspaceId: string
  before?: unknown
  after?: unknown
  metadata?: Record<string, unknown>
  createdAt: string
}
