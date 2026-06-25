import {
  orchestrateTestCreateSong,
  TestCreateSongOrchestrationRecord,
  TestCreateSongOrchestrationRepository,
} from "./test-create-song-orchestration"

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const workspaceId = "11111111-1111-4111-8111-111111111111"
const now = new Date("2026-05-18T12:00:00.000Z")

function createRepository(): TestCreateSongOrchestrationRepository & {
  records: TestCreateSongOrchestrationRecord[]
} {
  const records: TestCreateSongOrchestrationRecord[] = []
  return {
    records,
    async recordOrchestration(record) {
      records.push(record)
      return record
    },
  }
}

function validPayload() {
  return {
    workspace_id: workspaceId,
    title: "New Test Song",
    alternative_titles: ["Test Song Alt"],
    isrc: "ZAX123456789",
    iswc: "T1234567890",
    genre: "Afro Pop",
    language: "en",
    duration_seconds: 210,
    release_date: "2026-06-01",
    contributors: [
      {
        contributor_id: "contributor_1",
        display_name: "Ava Composer",
        contributor_type: "person",
        roles: ["composer"],
        verification_status: "verified",
      },
      {
        contributor_id: "contributor_2",
        display_name: "Neo Writer",
        contributor_type: "person",
        roles: ["songwriter"],
        verification_status: "pending",
      },
    ],
    splits: [
      {
        contributor_id: "contributor_1",
        role: "composer",
        split_type: "ownership",
        percentage: 60,
      },
      {
        contributor_id: "contributor_2",
        role: "songwriter",
        split_type: "ownership",
        percentage: 40,
      },
    ],
    asset_references: [
      {
        asset_id: "asset_1",
        asset_type: "audio",
        asset_category: "song_file",
        title: "Demo mix",
        storage_path: "test/demo.wav",
      },
    ],
    metadata: { source: "test" },
    actor_user_id: "user_1",
  }
}

async function run() {
  const repository = createRepository()
  const valid = await orchestrateTestCreateSong({
    repository,
    payload: validPayload(),
    now,
  })

  assert(valid.ok, "Valid create-song orchestration must be accepted.")
  assert(
    valid.ok && valid.data.songDraftSummary.title === "New Test Song",
    "Result must include song draft summary."
  )
  assert(
    valid.ok && valid.data.contributorValidation.valid,
    "Result must include contributor validation."
  )
  assert(
    valid.ok &&
      (valid.data.splitValidation as { valid: boolean }).valid === true,
    "Result must include split validation."
  )
  assert(
    valid.ok && valid.data.assetReferenceSummary.assetCount === 1,
    "Result must include asset reference summary."
  )
  assert(
    valid.ok && Boolean(valid.data.lifecycleEventSummary),
    "Result must include lifecycle event summary."
  )
  assert(
    valid.ok && Boolean(valid.data.auditEventSummary),
    "Result must include audit event summary."
  )
  assert(
    valid.ok && valid.data.readinessPlaceholder.state === "ready_for_review",
    "Result must include readiness placeholder."
  )
  assert(
    valid.ok && valid.data.productionActivation === false,
    "Orchestration must not activate production."
  )

  const missingTitle = await orchestrateTestCreateSong({
    repository,
    payload: {
      ...validPayload(),
      title: "",
    },
    now,
  })
  assert(!missingTitle.ok, "Missing title must be rejected.")
  assert(
    !missingTitle.ok && missingTitle.error.code === "TITLE_REQUIRED",
    "Missing title must return TITLE_REQUIRED."
  )

  const invalidSplit = await orchestrateTestCreateSong({
    repository,
    payload: {
      ...validPayload(),
      splits: [
        {
          contributor_id: "contributor_1",
          role: "composer",
          split_type: "ownership",
          percentage: 90,
        },
      ],
    },
    now,
  })
  assert(!invalidSplit.ok, "Invalid split total must be rejected.")
  assert(
    !invalidSplit.ok && invalidSplit.error.code === "SPLIT_VALIDATION_FAILED",
    "Invalid split total must return SPLIT_VALIDATION_FAILED."
  )

  const invalidContributor = await orchestrateTestCreateSong({
    repository,
    payload: {
      ...validPayload(),
      contributors: [
        {
          contributor_id: "contributor_bad",
          display_name: "Bad Role",
          contributor_type: "person",
          roles: ["bad_role"],
          verification_status: "pending",
        },
      ],
    },
    now,
  })
  assert(!invalidContributor.ok, "Contributor validation failure must be represented.")
  assert(
    !invalidContributor.ok &&
      invalidContributor.error.code === "CONTRIBUTOR_VALIDATION_FAILED",
    "Contributor validation failure must return CONTRIBUTOR_VALIDATION_FAILED."
  )

  const draftOnly = await orchestrateTestCreateSong({
    repository,
    payload: {
      ...validPayload(),
      asset_references: [],
    },
    now,
  })
  assert(draftOnly.ok, "Draft-only orchestration must be accepted.")
  assert(
    draftOnly.ok && draftOnly.data.readinessPlaceholder.state === "draft_only",
    "Missing asset references must return draft_only placeholder."
  )

  console.log("Test create song orchestration tests passed")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
