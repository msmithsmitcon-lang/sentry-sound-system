import { prisma } from "@/lib/db/prisma"

export async function createSubmissionQueueEvent(
  data: {
    submissionQueueId: string

    eventType: string

    oldStatus?: string | null

    newStatus?: string | null

    message?: string | null

    metadata?: unknown
  }
) {
  return prisma.submissionQueueEvent.create({
    data: {
      submissionQueueId:
        data.submissionQueueId,

      eventType:
        data.eventType,

      oldStatus:
        data.oldStatus,

      newStatus:
        data.newStatus,

      message:
        data.message,

      metadata:
        data.metadata,
    },
  })
}
