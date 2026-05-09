import { prisma } from "../../db/prisma"

export async function createSubmissionSnapshotRecord(data: {
  exportId: string
  submissionType: string
  entityType: string
  entityId: string
  fingerprint: string
  exportPayload: unknown
  exportFormat?: string
  generatedBy?: string
  generatedAt: Date
  status: string
}) {
  return prisma.submissionSnapshot.create({
    data: {
      exportId: data.exportId,
      submissionType: data.submissionType,
      entityType: data.entityType,
      entityId: data.entityId,
      fingerprint: data.fingerprint,
      exportPayload: data.exportPayload,
      exportFormat: data.exportFormat,
      generatedBy: data.generatedBy,
      generatedAt: data.generatedAt,
      status: data.status
    }
  })
}

export async function getSubmissionSnapshotsForEntity(input: {
  entityType: string
  entityId: string
}) {
  return prisma.submissionSnapshot.findMany({
    where: {
      entityType: input.entityType,
      entityId: input.entityId
    },
    orderBy: {
      createdAt: "desc"
    }
  })
}
