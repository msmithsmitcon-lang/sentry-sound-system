import { prisma } from "@/lib/db/prisma"

export async function updateSubmissionQueueStatus(
  submissionQueueId: string,
  status: string,
  metadata?: Record<string, unknown>
) {
  return prisma.submissionQueue.update({
    where: {
      id: submissionQueueId,
    },

    data: {
      status,

      metadata: metadata ?? undefined,

      updatedAt: new Date(),
    },
  })
}
