import { prisma } from "@/lib/db/prisma"

import {
  EscalationDeliveryMetrics,
} from "./escalation-delivery-metrics.types"

export async function getEscalationDeliveryMetrics(): Promise<EscalationDeliveryMetrics> {
  const totalNotifications =
    await prisma.escalationNotificationQueue.count()

  const dispatchedNotifications =
    await prisma.escalationNotificationQueue.count({
      where: {
        status: "DISPATCHED",
      },
    })

  const failedNotifications =
    await prisma.escalationNotificationQueue.count({
      where: {
        status: "FAILED",
      },
    })

  const queuedNotifications =
    await prisma.escalationNotificationQueue.count({
      where: {
        status: "QUEUED",
      },
    })

  return {
    totalNotifications,
    dispatchedNotifications,
    failedNotifications,
    queuedNotifications,

    successRate:
      totalNotifications === 0
        ? 0
        : dispatchedNotifications / totalNotifications,

    failureRate:
      totalNotifications === 0
        ? 0
        : failedNotifications / totalNotifications,
  }
}
