export type EscalationNotificationChannel =
  | "EMAIL"
  | "SMS"
  | "SLACK"
  | "IN_APP"
  | "EXECUTIVE_REPORT"

export interface EscalationNotificationPayload {
  escalationId: string

  severity: string

  lifecycleState: string

  channel: EscalationNotificationChannel

  recipients: string[]

  subject: string

  message: string

  createdAt: Date
}

export interface EscalationNotificationDispatchResult {
  success: boolean

  channel: EscalationNotificationChannel

  dispatchedAt?: Date

  failureReason?: string
}
