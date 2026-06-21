import { aggregateEvidenceReadiness, getEvidenceReadiness } from "./evidence-readiness-aggregator"
import { EvidenceReadinessActivity, EvidenceReadinessRepository } from "./evidence-readiness"

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const workspaceId = "11111111-1111-4111-8111-111111111111"

function activity(
  metadata: Record<string, unknown>,
  overrides: Partial<EvidenceReadinessActivity> = {}
): EvidenceReadinessActivity {
  return {
    id: overrides.id ?? `activity_${Math.random()}`,
    workspaceId,
    activityType: overrides.activityType ?? "test_create_song_orchestration",
    entityType: overrides.entityType ?? "song",
    entityId: overrides.entityId ?? "song_1",
    metadata,
    createdAt: overrides.createdAt ?? "2026-05-18T10:00:00.000Z",
  }
}

async function run() {
  const aggregation = aggregateEvidenceReadiness({
    workspaceId,
    entityType: "song",
    entityId: "song_1",
    activities: [
      activity({
        testCreateSongOrchestration: {
          contributorValidation: { contributorCount: 2 },
          splitValidation: { ready: true, valid: true },
          assetReferenceSummary: {
            assetCount: 2,
            assets: [
              { asset_type: "audio", asset_category: "song_file" },
              { asset_type: "evidence", asset_category: "evidence_file" },
            ],
          },
        },
        lifecycleEvent: { nextState: "metadata_started" },
        operationalAuditEvent: { action: "test_song.create_orchestration" },
      }),
    ],
  })

  assert(aggregation.readinessScore === 100, "Complete graph must score 100.")
  assert(
    aggregation.operationalReadinessStatus === "ready_for_review",
    "Complete graph must be ready for TEST review."
  )
  assert(
    aggregation.submissionGate.canQueueSubmission === false,
    "Submission gate must remain disabled."
  )
  assert(
    aggregation.flags.productionActivation === false,
    "Aggregator must not activate production."
  )

  const repository: EvidenceReadinessRepository = {
    async listReadinessActivities() {
      return []
    },
  }
  const invalid = await getEvidenceReadiness({ repository, workspaceId: " " })
  assert(!invalid.ok, "Missing workspace id must fail safely.")
  assert(
    !invalid.ok && invalid.error.code === "WORKSPACE_ID_REQUIRED",
    "Missing workspace id must return WORKSPACE_ID_REQUIRED."
  )

  const blockers = aggregateEvidenceReadiness({
    workspaceId,
    activities: [
      activity({
        testCreateSongOrchestration: {
          contributorValidation: { contributorCount: 0 },
          splitValidation: { ready: false, valid: false },
          assetReferenceSummary: { assetCount: 1, assets: [{ asset_type: "audio" }] },
        },
        lifecycleEvent: { nextState: "draft" },
        operationalAuditEvent: { action: "test_song.create_orchestration" },
      }),
    ],
  })

  assert(blockers.blockers.length === 3, "Missing contributor, split, and evidence must block.")
  assert(
    blockers.missingEvidence.length === 1,
    "Missing evidence file reference must be reported."
  )
  assert(
    blockers.complianceStatus === "missing_required_evidence",
    "Missing evidence must drive compliance status."
  )

  console.log("Evidence readiness tests passed")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
