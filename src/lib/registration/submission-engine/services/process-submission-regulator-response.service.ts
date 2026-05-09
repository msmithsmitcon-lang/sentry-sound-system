import { prisma } from "@/lib/db/prisma"

import { SubmissionRegulatorResponse } from "../contracts/submission-regulator-response.contract"

import { createSubmissionQueueEvent } from "../repositories/create-submission-queue-event"

import { createUndocumentedSubmissionCase } from "./create-undocumented-submission-case.service"

import { createSubmissionRemediationCase } from "../repositories/create-submission-remediation-case"

export async function processSubmissionRegulatorResponse(
  submissionQueueId: string,
  response: SubmissionRegulatorResponse
) {
  const updatedQueueItem =
    await prisma.submissionQueue.update({
      where: {
        id: submissionQueueId,
      },

      data: {
        status:
          response.status,

        regulatorReference:
          response.regulatorReference,

        metadata: {
          regulatorMessage:
            response.message,

          regulatorResponse:
            response.rawResponse,

          receivedAt:
            response.receivedAt.toISOString(),
        },
      },
    })

  await createSubmissionQueueEvent({
    submissionQueueId,

    eventType:
      "submission.regulator_response",

    oldStatus:
      null,

    newStatus:
      response.status,

    message:
      response.message,

    metadata: {
      regulator:
        response.regulator,

      regulatorReference:
        response.regulatorReference,
    },
  })

  if (
    response.status ===
    "undocumented"
  ) {
    await createUndocumentedSubmissionCase(
      submissionQueueId
    )
  }

  if (
    response.status ===
    "amendment_required"
  ) {
    await createSubmissionRemediationCase({
      submissionQueueId,

      type:
        "amendment_required",

      status:
        "open",

      reason:
        response.message ??
        "Regulator amendment requested.",

      requiredActions: [
        "Review regulator amendment request.",
        "Correct submission metadata.",
        "Resubmit corrected filing.",
      ],

      blocksRoyaltyEligibility:
        true,

      metadata: {
        regulator:
          response.regulator,
      },
    })
  }

  return updatedQueueItem
}
