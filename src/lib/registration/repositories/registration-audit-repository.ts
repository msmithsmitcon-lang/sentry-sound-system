import { prisma } from "../../db/prisma"

export async function createRegistrationAuditEventRecord(data: {
  eventType: string

  entityType: string
  entityId: string

  performedBy?: string

  reason?: string

  oldValue?: Record<string, unknown>
  newValue?: Record<string, unknown>

  relatedEvidenceIds?: unknown

  metadata?: Record<string, unknown>

  musicalWorkId?: string
  recordingId?: string
}) {
  return prisma.registrationAuditEvent.create({
    data: {
      eventType: data.eventType,

      entityType: data.entityType,
      entityId: data.entityId,

      performedBy: data.performedBy,

      reason: data.reason,

      oldValue: data.oldValue,
      newValue: data.newValue,

      relatedEvidenceIds: data.relatedEvidenceIds,

      metadata: data.metadata,

      musicalWorkId: data.musicalWorkId,
      recordingId: data.recordingId
    }
  })
}

export async function getAuditEventsForEntity(input: {
  entityType: string
  entityId: string
}) {
  return prisma.registrationAuditEvent.findMany({
    where: {
      entityType: input.entityType,
      entityId: input.entityId
    },
    orderBy: {
      createdAt: "desc"
    }
  })
}
