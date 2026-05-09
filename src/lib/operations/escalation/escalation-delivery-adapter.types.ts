export interface EscalationDeliveryRequest {
  notificationId: string

  channel: string

  recipients: string[]

  subject: string

  message: string
}

export interface EscalationDeliveryResult {
  success: boolean

  providerReference?: string

  deliveredAt?: Date

  failureReason?: string
}

export interface EscalationDeliveryAdapter {
  send(
    request: EscalationDeliveryRequest
  ): Promise<EscalationDeliveryResult>
}
