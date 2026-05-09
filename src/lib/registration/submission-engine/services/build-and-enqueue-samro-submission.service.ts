import { buildSamroSubmissionPackage } from "./build-samro-submission-package.service"

import { createSubmissionQueueItem } from "../repositories/create-submission-queue-item"

import { findActiveSubmissionQueueItem } from "../repositories/find-active-submission-queue-item"

import { SamroWorkExportRow } from "../contracts/samro-work-export-row.contract"

export async function buildAndEnqueueSamroSubmission(
  data: {
    entityType: string

    entityId: string

    rows: SamroWorkExportRow[]

    workspaceId?: string

    generatedBy?: string | null
  }
) {
  const submissionPackage =
    await buildSamroSubmissionPackage({
      entityType:
        data.entityType,

      entityId:
        data.entityId,

      rows:
        data.rows,

      generatedBy:
        data.generatedBy,
    })

  const existingQueueItem =
    await findActiveSubmissionQueueItem({
      target:
        "SAMRO",

      entityType:
        data.entityType,

      entityId:
        data.entityId,

      fingerprint:
        submissionPackage.fingerprint,
    })

  if (existingQueueItem) {
    return {
      package:
        submissionPackage,

      queueItem:
        existingQueueItem,

      reused:
        true,
    }
  }

  const queueItem =
    await createSubmissionQueueItem({
      workspaceId:
        data.workspaceId,

      target:
        "SAMRO",

      status:
        "queued",

      priority:
        "normal",

      entityType:
        data.entityType,

      entityId:
        data.entityId,

      exportFormat:
        "CSV",

      fingerprint:
        submissionPackage.fingerprint,

      snapshotId:
        submissionPackage.snapshot.id,

      metadata: {
        exportId:
          submissionPackage.snapshot.exportId,
      },
    })

  return {
    package:
      submissionPackage,

    queueItem,

    reused:
      false,
  }
}
