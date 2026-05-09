import { prisma } from "@/lib/db/prisma"

import {
  DispatchMetricsSnapshot
} from "./dispatchMetrics.types"

export async function getDispatchMetricsSnapshot():
  Promise<DispatchMetricsSnapshot> {

  const [
    queued,
    scheduled,
    dispatching,
    sent,
    failed,
    retrying,
    cancelled,
    total
  ] = await Promise.all([

    prisma.submissionDispatchQueue.count({
      where: { status: "queued" }
    }),

    prisma.submissionDispatchQueue.count({
      where: { status: "scheduled" }
    }),

    prisma.submissionDispatchQueue.count({
      where: { status: "dispatching" }
    }),

    prisma.submissionDispatchQueue.count({
      where: { status: "sent" }
    }),

    prisma.submissionDispatchQueue.count({
      where: { status: "failed" }
    }),

    prisma.submissionDispatchQueue.count({
      where: { status: "retrying" }
    }),

    prisma.submissionDispatchQueue.count({
      where: { status: "cancelled" }
    }),

    prisma.submissionDispatchQueue.count()
  ])

  return {
    queued,
    scheduled,
    dispatching,
    sent,
    failed,
    retrying,
    cancelled,
    total,

    generatedAt:
      new Date().toISOString()
  }
}
