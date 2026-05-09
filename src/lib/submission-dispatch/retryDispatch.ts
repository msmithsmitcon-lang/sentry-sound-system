import { prisma } from "@/lib/db/prisma"

import {
  DispatchFailureResult,
  RetryDispatchInput
} from "./dispatchFailure.types"

export async function retryDispatch(
  input: RetryDispatchInput
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

  if (
    dispatch.retryCount >=
    dispatch.maxRetries
  ) {
    throw new Error(
      "Maximum retry count exceeded"
    )
  }

  const updated =
    await prisma.submissionDispatchQueue
      .update({
        where: {
          id: dispatch.id
        },

        data: {
          status: "retrying"
        }
      })

  return {
    dispatchId:
      updated.id,

    status: "retrying",

    retryCount:
      updated.retryCount,

    reason:
      "Retry initiated",

    updatedAt:
      updated.updatedAt.toISOString()
  }
}
