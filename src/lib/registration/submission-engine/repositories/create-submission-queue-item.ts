import { prisma } from "@/lib/db/prisma"

export async function createSubmissionQueueItem(
  data: {
    workspaceId?: string

    target: string

    status: string

    priority: string

    entityType: string

    entityId: string

    exportFormat: string

    fingerprint: string

    version?: number

    retryCount?: number

    maxRetries?: number

    regulatorReference?: string | null

    scheduledAt?: Date | null

    expiresAt?: Date | null

    blockingIssues?: unknown

    metadata?: unknown

    snapshotId?: string | null
  }
) {
  return prisma.submissionQueue.create({
    data: {
      workspaceId: data.workspaceId,

      target: data.target,

      status: data.status,

      priority: data.priority,

      entityType: data.entityType,

      entityId: data.entityId,

      exportFormat: data.exportFormat,

      fingerprint: data.fingerprint,

      version: data.version ?? 1,

      retryCount: data.retryCount ?? 0,

      maxRetries: data.maxRetries ?? 5,

      regulatorReference:
        data.regulatorReference,

      scheduledAt:
        data.scheduledAt,

      expiresAt:
        data.expiresAt,

      blockingIssues:
        data.blockingIssues,

      metadata:
        data.metadata,

      snapshotId:
        data.snapshotId,
    },
  })
}
