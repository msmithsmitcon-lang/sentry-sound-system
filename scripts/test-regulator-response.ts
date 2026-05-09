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
    throw new Error(
      "No submission queue item found."
    )
  }

  const result =
    await processSubmissionRegulatorResponse(
      latestQueueItem.id,
      {
        regulator:
          "SAMRO",

        regulatorReference:
          "SAMRO-REF-2026-001",

        status:
          "accepted",

        message:
          "Submission accepted by SAMRO.",

        rawResponse: {
          externalStatus:
            "ACCEPTED",
        },

        receivedAt:
          new Date(),
      }
    )

  console.log(
    JSON.stringify(
      result,
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
