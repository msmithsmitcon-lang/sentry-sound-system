import {
  EscalationDeliveryAdapter,
  EscalationDeliveryRequest,
  EscalationDeliveryResult,
} from "./escalation-delivery-adapter.types"

export class MockEscalationDeliveryAdapter implements EscalationDeliveryAdapter {
  async send(
    request: EscalationDeliveryRequest
  ): Promise<EscalationDeliveryResult> {
    if (!request.recipients.length) {
      return {
        success: false,
        failureReason: "No recipients provided.",
      }
    }

    return {
      success: true,
      providerReference: `mock_${request.notificationId}`,
      deliveredAt: new Date(),
    }
  }
}
