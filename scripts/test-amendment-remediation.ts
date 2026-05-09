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
        regulatorReference: "SAMRO-AMEND-2026-001",
        status: "amendment_required",
        message: "SAMRO requires corrected ownership metadata before acceptance.",
        rawResponse: {
          externalStatus: "AMENDMENT_REQUIRED",
          reason: "Ownership metadata correction required",
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
