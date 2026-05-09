import { prisma } from "@/lib/db/prisma"

import type { Prisma }
  from "@/generated/prisma/client"

import {
  CreateDispatchAttemptInput
} from "./dispatchAttempt.types"

export async function createDispatchAttempt(
  input: CreateDispatchAttemptInput
) {

  return prisma.submissionDispatchAttempt.create({
    data: {
      dispatchId:
        input.dispatchId,

      attemptNumber:
        input.attemptNumber,

      status:
        input.status,

      message:
        input.message ?? undefined,

      regulatorResponse:
        input.regulatorResponse as Prisma.InputJsonValue,

      metadata:
        input.metadata as Prisma.InputJsonValue
    }
  })
}
