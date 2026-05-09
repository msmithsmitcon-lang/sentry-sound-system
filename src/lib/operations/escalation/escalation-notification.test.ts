import { EscalationNotificationPayload } from "./escalation-notification.types"

const payload: EscalationNotificationPayload = {
  escalationId: "esc_001",
  severity: "CRITICAL",
  lifecycleState: "ESCALATED",
  channel: "EMAIL",
  recipients: ["operations@example.com"],
  subject: "Critical escalation triggered",
  message: "A critical operational escalation requires attention.",
  createdAt: new Date(),
}

if (payload.channel !== "EMAIL") {
  throw new Error("Expected notification channel EMAIL.")
}

if (payload.recipients.length !== 1) {
  throw new Error("Expected one notification recipient.")
}

console.log("Escalation Notification Contract V1 test passed", payload)
