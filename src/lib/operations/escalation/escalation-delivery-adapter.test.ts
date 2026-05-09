import { MockEscalationDeliveryAdapter } from "./escalation-delivery-adapter.mock"

async function main() {
  const adapter = new MockEscalationDeliveryAdapter()

  const result = await adapter.send({
    notificationId: "notif_001",
    channel: "EMAIL",
    recipients: ["ops@example.com"],
    subject: "Critical escalation",
    message: "A critical escalation requires operational review.",
  })

  if (!result.success) {
    throw new Error("Expected mock delivery to succeed.")
  }

  if (!result.providerReference) {
    throw new Error("Expected provider reference.")
  }

  console.log("Escalation Delivery Adapter V1 test passed", result)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
