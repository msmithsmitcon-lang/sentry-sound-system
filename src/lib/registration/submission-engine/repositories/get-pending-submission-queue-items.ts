import { prisma } from "@/lib/db/prisma"

export async function getPendingSubmissionQueueItems(
  limit = 25
) {
  return prisma.submissionQueue.findMany({
    where: {
      status: {
        in: [
          "queued",
          "retry_pending",
        ],
      },
    },

    orderBy: [
      {
        priority: "desc",
      },
      {
        createdAt: "asc",
      },
    ],

    take: limit,
  })
}
