import { randomUUID } from "crypto"
import { queueEscalationNotification } from "./escalation-notification-queue.service"

async function main() {
  const queued = await queueEscalationNotification({
    id: randomUUID(),
    escalationId: "esc_test_001",
    channel: "EMAIL",
    recipients: ["operations@example.com"],
    subject: "Queued escalation notification",
    message: "This escalation notification was queued for future delivery.",
  })

  if (!queued.id) {
    throw new Error("Expected queued notification id.")
  }

  if (queued.status !== "QUEUED") {
    throw new Error("Expected notification status QUEUED.")
  }

  console.log("Escalation Notification Queue V1 test passed", queued)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
