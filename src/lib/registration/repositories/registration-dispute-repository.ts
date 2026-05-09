import { prisma } from "../../db/prisma"

export async function createRegistrationDisputeRecord(data: {
  disputeType: string
  disputeStatus: string

  relatedEntityType: string
  relatedEntityId: string

  openedBy?: string

  description: string

  evidenceIds?: unknown

  proposedResolution?: string

  affectsRegistrationStatus?: boolean

  resultingRegistrationStatus?: string

  musicalWorkId?: string
  recordingId?: string
}) {
  return prisma.registrationDispute.create({
    data: {
      disputeType: data.disputeType,
      disputeStatus: data.disputeStatus,

      relatedEntityType: data.relatedEntityType,
      relatedEntityId: data.relatedEntityId,

      openedBy: data.openedBy,

      description: data.description,

      evidenceIds: data.evidenceIds,

      proposedResolution: data.proposedResolution,

      affectsRegistrationStatus:
        data.affectsRegistrationStatus ?? true,

      resultingRegistrationStatus:
        data.resultingRegistrationStatus,

      musicalWorkId: data.musicalWorkId,
      recordingId: data.recordingId
    }
  })
}

export async function getDisputesForEntity(input: {
  relatedEntityType: string
  relatedEntityId: string
}) {
  return prisma.registrationDispute.findMany({
    where: {
      relatedEntityType: input.relatedEntityType,
      relatedEntityId: input.relatedEntityId
    },
    orderBy: {
      createdAt: "desc"
    }
  })
}
