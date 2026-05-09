export interface EscalationAcknowledgement {
  escalationId: string

  acknowledgedByRole: string

  acknowledgedAt: Date
}

export interface EscalationAcknowledgementResult {
  isAcknowledged: boolean

  acknowledgedByRole?: string

  acknowledgedAt?: Date

  reason: string
}
