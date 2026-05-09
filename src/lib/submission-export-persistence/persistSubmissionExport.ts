import { prisma } from "@/lib/db/prisma"

import type { Prisma }
  from "@/generated/prisma/client"

import {
  PersistSubmissionExportInput
} from "./persistSubmissionExport.types"

export async function persistSubmissionExport(
  input: PersistSubmissionExportInput
) {

  return prisma.submissionExport.create({
    data: {
      regulator:
        input.regulator,

      format:
        input.format,

      payload:
        input.payload as Prisma.InputJsonValue,

      manifestId:
        input.manifestId ?? undefined,

      submissionQueueId:
        input.submissionQueueId ?? undefined,

      metadata:
        input.metadata as Prisma.InputJsonValue
    }
  })
}
