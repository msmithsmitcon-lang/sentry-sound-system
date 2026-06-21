export interface RuntimeAuditRecord {
  auditId: string

  learnerId: string

  programmeId: string
  moduleId: string
  slbId: string

  sessionId: string

  actionType: string

  runtimeState: string

  metadata?: Record<string, any>

  createdAt: string
}
