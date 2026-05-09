import { prisma } from "@/lib/db/prisma"

export async function findActiveSubmissionQueueItem(
  data: {
    target: string

    entityType: string

    entityId: string

    fingerprint: string
  }
) {
  return prisma.submissionQueue.findFirst({
    where: {
      target:
        data.target,

      entityType:
        data.entityType,

      entityId:
        data.entityId,

      fingerprint:
        data.fingerprint,

      status: {
        in: [
          "generated",
          "queued",
          "validating",
          "validated",
          "packaged",
          "retry_pending",
          "submitted",
        ],
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  })
}
