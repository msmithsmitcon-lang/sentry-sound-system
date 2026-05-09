import { prisma } from "@/lib/db/prisma"

import type { Prisma }
  from "@/generated/prisma/client"

import {
  CreateSubmissionDispatchInput
} from "./submissionDispatch.types"

export async function createSubmissionDispatch(
  input: CreateSubmissionDispatchInput
) {

  return prisma.submissionDispatchQueue.create({
    data: {
      submissionExportId:
        input.submissionExportId,

      regulator:
        input.regulator,

      status:
        input.status ?? "queued",

      scheduledAt:
        input.scheduledAt
          ? new Date(input.scheduledAt)
          : undefined,

      metadata:
        input.metadata as Prisma.InputJsonValue
    }
  })
}
