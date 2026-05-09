import { randomUUID } from "crypto"
import { quarantineEscalationNotification } from "./escalation-dead-letter.service"

async function main() {
  const deadLetter = await quarantineEscalationNotification({
    id: randomUUID(),
    notificationId: "notif_dead_letter_test_001",
    escalationId: "esc_dead_letter_test_001",
    channel: "EMAIL",
    failureReason: "Maximum retry count reached.",
    originalStatus: "FAILED",
  })

  if (!deadLetter.id) {
    throw new Error("Expected dead-letter id.")
  }

  if (deadLetter.original_status !== "FAILED") {
    throw new Error("Expected original status FAILED.")
  }

  console.log("Escalation Dead Letter Governance V1 test passed", deadLetter)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
