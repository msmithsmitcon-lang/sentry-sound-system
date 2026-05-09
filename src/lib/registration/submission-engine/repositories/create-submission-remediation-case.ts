import { prisma } from "@/lib/db/prisma"

import { SubmissionRemediationCase } from "../contracts/submission-remediation-case.contract"

export async function createSubmissionRemediationCase(
  data: SubmissionRemediationCase
) {
  const existingCase =
    await prisma.submissionRemediationCase.findFirst({
      where: {
        submissionQueueId:
          data.submissionQueueId,

        type:
          data.type,

        status: {
          in: [
            "open",
            "in_progress",
            "blocked",
          ],
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    })

  if (existingCase) {
    return existingCase
  }

  return prisma.submissionRemediationCase.create({
    data: {
      submissionQueueId:
        data.submissionQueueId,

      type:
        data.type,

      status:
        data.status,

      reason:
        data.reason,

      requiredActions:
        data.requiredActions,

      blocksRoyaltyEligibility:
        data.blocksRoyaltyEligibility,

      dueAt:
        data.dueAt,

      metadata:
        data.metadata,
    },
  })
}
