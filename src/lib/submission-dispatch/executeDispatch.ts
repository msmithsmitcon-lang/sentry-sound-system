import { prisma } from "@/lib/db/prisma"

import {
  ExecuteDispatchInput,
  ExecuteDispatchResult
} from "./executeDispatch.types"

export async function executeDispatch(
  input: ExecuteDispatchInput
): Promise<ExecuteDispatchResult> {

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

  await prisma.submissionDispatchQueue
    .update({
      where: {
        id: dispatch.id
      },

      data: {
        status: "sent",

        dispatchedAt:
          new Date()
      }
    })

  return {
    dispatchId:
      dispatch.id,

    success: true,

    finalStatus: "sent",

    executedAt:
      new Date().toISOString(),

    message:
      "Dispatch executed successfully"
  }
}
