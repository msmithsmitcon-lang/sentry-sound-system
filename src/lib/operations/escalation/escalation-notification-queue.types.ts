export type EscalationNotificationQueueStatus =
  | "QUEUED"
  | "DISPATCHED"
  | "FAILED"

export interface QueueEscalationNotificationInput {
  id: string

  escalationId: string

  channel: string

  recipients: string[]

  subject: string

  message: string
}
