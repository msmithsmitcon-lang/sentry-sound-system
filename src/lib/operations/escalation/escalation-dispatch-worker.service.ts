import { prisma } from "@/lib/db/prisma"

import { MockEscalationDeliveryAdapter } from "./escalation-delivery-adapter.mock"

export async function processQueuedEscalationNotifications() {
  const queuedNotifications =
    await prisma.escalationNotificationQueue.findMany({
      where: {
        status: "QUEUED",
      },
    })

  const adapter = new MockEscalationDeliveryAdapter()

  for (const notification of queuedNotifications) {
    const result = await adapter.send({
      notificationId: notification.id,
      channel: notification.channel,
      recipients: notification.recipients as string[],
      subject: notification.subject,
      message: notification.message,
    })

    if (result.success) {
      await prisma.escalationNotificationQueue.update({
        where: {
          id: notification.id,
        },

        data: {
          status: "DISPATCHED",
          dispatched_at: result.deliveredAt,
        },
      })

      continue
    }

    await prisma.escalationNotificationQueue.update({
      where: {
        id: notification.id,
      },

      data: {
        status: "FAILED",
        failed_at: new Date(),
        failure_reason: result.failureReason,
      },
    })
  }

  return {
    processedCount: queuedNotifications.length,
  }
}
