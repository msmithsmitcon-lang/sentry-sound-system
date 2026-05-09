export interface EscalationDeadLetterInput {
  id: string

  notificationId: string

  escalationId: string

  channel: string

  failureReason: string

  originalStatus: string
}
