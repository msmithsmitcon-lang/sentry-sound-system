import { prisma } from "@/lib/db/prisma"

import {
  DispatchFailureResult,
  FailDispatchInput
} from "./dispatchFailure.types"

export async function failDispatch(
  input: FailDispatchInput
): Promise<DispatchFailureResult> {

  const dispatch =
    await prisma.submissionDispatchQueue
      .findUnique({
        where: {
          id: input.dispatchId
        }
      })

  if (!dispatch) {
    throw new Error(
      "Dispatch queue item not found"
    )
  }

  const updated =
    await prisma.submissionDispatchQueue
      .update({
        where: {
          id: dispatch.id
        },

        data: {
          status: "failed",

          failedAt:
            new Date(),

          retryCount:
            dispatch.retryCount + 1,

          metadata: {
            ...(dispatch.metadata as object),

            failureReason:
              input.reason
          }
        }
      })

  return {
    dispatchId:
      updated.id,

    status: "failed",

    retryCount:
      updated.retryCount,

    reason:
      input.reason,

    updatedAt:
      updated.updatedAt.toISOString()
  }
}
