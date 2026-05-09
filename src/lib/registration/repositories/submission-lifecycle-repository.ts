import { prisma } from "../../db/prisma"

export async function updateSubmissionSnapshotLifecycle(input: {
  exportId: string

  status:
    | "generated"
    | "queued"
    | "submitted"
    | "accepted"
    | "rejected"
    | "amended"
    | "resubmitted"

  regulatorResponse?: unknown
}) {

  return prisma.submissionSnapshot.update({
    where: {
      exportId: input.exportId
    },

    data: {
      status: input.status,

      regulatorResponse:
        input.regulatorResponse,

      submittedAt:
        input.status === "submitted"
          ? new Date()
          : undefined
    }
  })
}
