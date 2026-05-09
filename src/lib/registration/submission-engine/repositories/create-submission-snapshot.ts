import { prisma } from "@/lib/db/prisma"

export async function createSubmissionSnapshot(
  data: {
    entityType: string

    entityId: string

    fingerprint: string

    exportPayload: unknown

    exportFormat?: string | null

    generatedBy?: string | null

    status: string

    regulatorResponse?: unknown
  }
) {
  const exportId =
    `${data.entityType}-${data.entityId}-${data.fingerprint.slice(0, 12)}`

  return prisma.submissionSnapshot.upsert({
    where: {
      exportId,
    },

    update: {},

    create: {
      exportId,

      submissionType:
        data.exportFormat ?? "UNKNOWN",

      entityType:
        data.entityType,

      entityId:
        data.entityId,

      fingerprint:
        data.fingerprint,

      exportPayload:
        data.exportPayload,

      exportFormat:
        data.exportFormat,

      generatedBy:
        data.generatedBy,

      generatedAt:
        new Date(),

      regulatorResponse:
        data.regulatorResponse,

      status:
        data.status,
    },
  })
}
