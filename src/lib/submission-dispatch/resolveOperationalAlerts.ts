import { prisma } from "@/lib/db/prisma"

import {
  OperationalAlert
} from "./operationalAlert.types"

export async function resolveOperationalAlerts():
  Promise<OperationalAlert[]> {

  const alerts:
    OperationalAlert[] = []

  const failedCount =
    await prisma.submissionDispatchQueue
      .count({
        where: {
          status: "failed"
        }
      })

  if (failedCount >= 5) {

    alerts.push({
      type:
        "dispatch_failures",

      severity:
        "critical",

      message:
        "High failed dispatch volume detected",

      metadata: {
        failedCount
      },

      createdAt:
        new Date().toISOString()
    })
  }

  const queuedCount =
    await prisma.submissionDispatchQueue
      .count({
        where: {
          status: "queued"
        }
      })

  if (queuedCount >= 25) {

    alerts.push({
      type:
        "queue_backlog",

      severity:
        "warning",

      message:
        "Dispatch queue backlog detected",

      metadata: {
        queuedCount
      },

      createdAt:
        new Date().toISOString()
    })
  }

  return alerts
}
