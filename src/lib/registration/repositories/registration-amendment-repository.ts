import { prisma } from "../../db/prisma"

export async function createRegistrationAmendmentRecord(data: {
  amendmentType: string
  amendmentStatus: string

  relatedEntityType: string
  relatedEntityId: string

  requestedBy?: string

  reason: string

  oldValues?: unknown
  newValues?: unknown

  evidenceIds?: unknown

  requiresReconfirmation?: boolean

  musicalWorkId?: string
  recordingId?: string
}) {
  return prisma.registrationAmendment.create({
    data: {
      amendmentType: data.amendmentType,
      amendmentStatus: data.amendmentStatus,

      relatedEntityType: data.relatedEntityType,
      relatedEntityId: data.relatedEntityId,

      requestedBy: data.requestedBy,

      reason: data.reason,

      oldValues: data.oldValues,
      newValues: data.newValues,

      evidenceIds: data.evidenceIds,

      requiresReconfirmation:
        data.requiresReconfirmation ?? false,

      musicalWorkId: data.musicalWorkId,
      recordingId: data.recordingId
    }
  })
}

export async function getAmendmentsForEntity(input: {
  relatedEntityType: string
  relatedEntityId: string
}) {
  return prisma.registrationAmendment.findMany({
    where: {
      relatedEntityType: input.relatedEntityType,
      relatedEntityId: input.relatedEntityId
    },
    orderBy: {
      createdAt: "desc"
    }
  })
}
