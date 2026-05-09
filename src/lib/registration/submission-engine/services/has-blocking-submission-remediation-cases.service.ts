import { prisma } from "@/lib/db/prisma"

export async function hasBlockingSubmissionRemediationCases(
  submissionQueueId: string
): Promise<boolean> {
  const blockingCase =
    await prisma.submissionRemediationCase.findFirst({
      where: {
        submissionQueueId,

        blocksRoyaltyEligibility:
          true,

        status: {
          in: [
            "open",
            "in_progress",
            "blocked",
          ],
        },
      },
    })

  return Boolean(blockingCase)
}
