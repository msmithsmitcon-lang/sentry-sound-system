import { randomUUID } from "crypto"
import { prisma } from "@/lib/db/prisma"

import { queueEscalationNotification } from "./escalation-notification-queue.service"
import { processQueuedEscalationNotifications } from "./escalation-dispatch-worker.service"

async function main() {
  const notificationId = randomUUID()

  await queueEscalationNotification({
    id: notificationId,
    escalationId: "esc_worker_test_001",
    channel: "EMAIL",
    recipients: ["operations@example.com"],
    subject: "Worker dispatch test",
    message: "This queued escalation notification should be dispatched by the worker.",
  })

  const result = await processQueuedEscalationNotifications()

  const updated =
    await prisma.escalationNotificationQueue.findUniqueOrThrow({
      where: {
        id: notificationId,
      },
    })

  if (updated.status !== "DISPATCHED") {
    throw new Error("Expected notification status DISPATCHED.")
  }

  if (!updated.dispatched_at) {
    throw new Error("Expected dispatched_at timestamp.")
  }

  console.log("Escalation Dispatch Worker V1 test passed", {
    result,
    updated,
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
