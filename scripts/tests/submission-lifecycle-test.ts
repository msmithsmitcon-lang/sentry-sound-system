import {
  buildSamroWorkExportPayload
} from "../../src/lib/registration/services/build-samro-work-export-payload"

import {
  generateExportFingerprint
} from "../../src/lib/registration/services/generate-export-fingerprint"

import {
  createSubmissionSnapshotRecord,
  getSubmissionSnapshotsForEntity
} from "../../src/lib/registration/repositories/submission-snapshot-repository"

import {
  updateSubmissionSnapshotLifecycle
} from "../../src/lib/registration/repositories/submission-lifecycle-repository"

async function main() {

  const payload =
    buildSamroWorkExportPayload({
      workId:
        "work_lifecycle_001",

      title:
        "Submission Lifecycle Test",

      contributors: [
        {
          contributorName:
            "Composer One",

          role:
            "composer",

          ownershipPercentage:
            100
        }
      ],

      evidence: [],

      generatedBy:
        "lifecycle_test"
    })

  const fingerprint =
    generateExportFingerprint(payload)

  await createSubmissionSnapshotRecord({
    exportId:
      fingerprint.exportId,

    submissionType:
      payload.exportType,

    entityType:
      "musical_work",

    entityId:
      payload.work.workId,

    fingerprint:
      fingerprint.fingerprint,

    exportPayload:
      payload,

    exportFormat:
      "json",

    generatedBy:
      "lifecycle_test",

    generatedAt:
      new Date(
        fingerprint.generatedAt
      ),

    status:
      "generated"
  })

  await updateSubmissionSnapshotLifecycle({
    exportId:
      fingerprint.exportId,

    status:
      "submitted",

    regulatorResponse: {
      regulator:
        "SAMRO",

      submissionReference:
        "SAMRO-2026-001"
    }
  })

  const snapshots =
    await getSubmissionSnapshotsForEntity({
      entityType:
        "musical_work",

      entityId:
        "work_lifecycle_001"
    })

  console.log(
    "\n=== SUBMISSION LIFECYCLE ===\n"
  )

  console.log(
    JSON.stringify(
      snapshots,
      null,
      2
    )
  )

  if (
    snapshots[0].status !==
    "submitted"
  ) {
    throw new Error(
      "Expected submitted status"
    )
  }

  if (
    !snapshots[0].submittedAt
  ) {
    throw new Error(
      "Expected submittedAt timestamp"
    )
  }

  console.log(
    "\nSubmission lifecycle test passed.\n"
  )
}

main()
