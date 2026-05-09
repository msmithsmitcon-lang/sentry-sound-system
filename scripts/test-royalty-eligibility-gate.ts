import { prisma } from "../src/lib/db/prisma"

import { hasBlockingSubmissionRemediationCases } from "../src/lib/registration/submission-engine/services/has-blocking-submission-remediation-cases.service"

async function main() {
  const latestQueueItem =
    await prisma.submissionQueue.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    })

  if (!latestQueueItem) {
    throw new Error(
      "No queue item found."
    )
  }

  const blocked =
    await hasBlockingSubmissionRemediationCases(
      latestQueueItem.id
    )

  console.log(
    JSON.stringify(
      {
        submissionQueueId:
          latestQueueItem.id,

        status:
          latestQueueItem.status,

        royaltyEligibilityBlocked:
          blocked,
      },
      null,
      2
    )
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
