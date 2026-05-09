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

async function main() {
  const payload = buildSamroWorkExportPayload({
    workId: "work_001",
    title: "Submission Snapshot Test",
    contributors: [
      {
        contributorName: "Composer One",
        role: "composer",
        ownershipPercentage: 100
      }
    ],
    evidence: [],
    readinessScore: 100,
    generatedBy: "snapshot_test"
  })

  const fingerprint = generateExportFingerprint(payload)

  await createSubmissionSnapshotRecord({
    exportId: fingerprint.exportId,
    submissionType: payload.exportType,
    entityType: "musical_work",
    entityId: payload.work.workId,
    fingerprint: fingerprint.fingerprint,
    exportPayload: payload,
    exportFormat: "json",
    generatedBy: "snapshot_test",
    generatedAt: new Date(fingerprint.generatedAt),
    status: "generated"
  })

  const snapshots = await getSubmissionSnapshotsForEntity({
    entityType: "musical_work",
    entityId: "work_001"
  })

  console.log("\n=== SUBMISSION SNAPSHOTS ===\n")
  console.log(JSON.stringify(snapshots, null, 2))

  if (snapshots.length < 1) {
    throw new Error("Expected at least one submission snapshot")
  }

  if (snapshots[0].fingerprint !== fingerprint.fingerprint) {
    throw new Error("Expected persisted fingerprint")
  }

  console.log("\nSubmission snapshot persistence test passed.\n")
}

main()
