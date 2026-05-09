import { prisma } from "../src/lib/db/prisma"

import { processSubmissionRegulatorResponse } from "../src/lib/registration/submission-engine/services/process-submission-regulator-response.service"

async function main() {
  const latestQueueItem =
    await prisma.submissionQueue.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    })

  if (!latestQueueItem) {
    throw new Error("No submission queue item found.")
  }

  const result =
    await processSubmissionRegulatorResponse(
      latestQueueItem.id,
      {
        regulator: "SAMRO",
        regulatorReference: "SAMRO-UNDOC-2026-001",
        status: "undocumented",
        message: "Submission marked undocumented due to missing supporting evidence.",
        rawResponse: {
          externalStatus: "UNDOCUMENTED",
          reason: "Missing evidence pack",
        },
        receivedAt: new Date(),
      }
    )

  const remediationCases =
    await prisma.submissionRemediationCase.findMany({
      where: {
        submissionQueueId: latestQueueItem.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

  console.log(
    JSON.stringify(
      {
        updatedQueueItem: result,
        remediationCases,
      },
      null,
      2
    )
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
