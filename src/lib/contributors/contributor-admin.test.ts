import {
  ContributorAdminRepository,
  createContributor,
  getContributorSummary,
  listContributors,
  validateContributorSplits,
} from "./contributor-admin"
import { ContributorIdentity } from "./contributor-governance"

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const workspaceId = "11111111-1111-4111-8111-111111111111"

function createRepository(
  contributors: ContributorIdentity[] = []
): ContributorAdminRepository & { contributors: ContributorIdentity[] } {
  return {
    contributors,
    async listContributors(input) {
      return contributors
        .filter((contributor) => contributor.workspaceId === input.workspaceId)
        .slice(0, input.limit)
    },
    async createContributor(contributor) {
      contributors.unshift(contributor)
      return contributor
    },
  }
}

async function run() {
  const repository = createRepository()
  const valid = await createContributor({
    repository,
    contributor: {
      contributorId: "contributor_1",
      workspaceId,
      displayName: "Ava Composer",
      legalName: "Ava Composer Legal",
      email: "ava@example.com",
      contributorType: "person",
      roles: ["composer", "songwriter"],
      ipiCae: "123456789",
      proAffiliation: "SAMRO",
      country: "za",
      verificationStatus: "verified",
      metadata: { source: "test" },
      createdAt: "2026-05-18T12:00:00.000Z",
    },
  })

  assert(valid.ok, "Valid contributor must be accepted.")
  assert(
    valid.ok && valid.data.contributor.productionActivation === false,
    "Contributor event must not activate production."
  )
  assert(
    valid.ok && Boolean(valid.data.contributor.auditEvent),
    "Contributor event must include audit event shape."
  )
  assert(
    valid.ok && Boolean(valid.data.contributor.lifecycleEvent),
    "Contributor event must include lifecycle event shape."
  )

  const invalidRole = await createContributor({
    repository,
    contributor: {
      workspaceId,
      displayName: "Bad Role",
      contributorType: "person",
      roles: ["wizard"],
      verificationStatus: "pending",
    },
  })

  assert(!invalidRole.ok, "Invalid role must be rejected.")
  assert(
    !invalidRole.ok && invalidRole.error.code === "INVALID_CONTRIBUTOR_ROLE",
    "Invalid role must return INVALID_CONTRIBUTOR_ROLE."
  )

  const invalidVerification = await createContributor({
    repository,
    contributor: {
      workspaceId,
      displayName: "Bad Status",
      contributorType: "person",
      roles: ["composer"],
      verificationStatus: "approved",
    },
  })

  assert(!invalidVerification.ok, "Invalid verification status must be rejected.")
  assert(
    !invalidVerification.ok &&
      invalidVerification.error.code === "INVALID_VERIFICATION_STATUS",
    "Invalid verification status must return INVALID_VERIFICATION_STATUS."
  )

  const validSplits = validateContributorSplits({
    workspaceId,
    linkedEntityType: "song",
    linkedEntityId: "song_1",
    splits: [
      {
        contributorId: "contributor_1",
        role: "composer",
        splitType: "ownership",
        percentage: 60,
      },
      {
        contributorId: "contributor_2",
        role: "songwriter",
        splitType: "ownership",
        percentage: 40,
      },
    ],
  })

  assert(validSplits.ok, "Split validation must return a result.")
  assert(validSplits.ok && validSplits.data.valid, "Split total 100 must be valid.")

  const invalidSplits = validateContributorSplits({
    workspaceId,
    linkedEntityType: "song",
    linkedEntityId: "song_1",
    splits: [
      {
        contributorId: "contributor_1",
        role: "composer",
        splitType: "ownership",
        percentage: 90,
      },
    ],
  })

  assert(invalidSplits.ok, "Invalid split total must be represented.")
  assert(
    invalidSplits.ok && !invalidSplits.data.valid,
    "Split total not 100 must be rejected as invalid."
  )

  const draftSplits = validateContributorSplits({
    workspaceId,
    linkedEntityType: "song",
    linkedEntityId: "song_1",
    splits: [],
  })

  assert(draftSplits.ok, "Draft split state must be represented.")
  assert(
    draftSplits.ok && draftSplits.data.state === "draft_incomplete",
    "Draft/incomplete split state must be explicit."
  )

  const listed = await listContributors({ repository, workspaceId })
  assert(listed.ok, "Contributor list shape must succeed.")
  assert(
    listed.ok && listed.data.contributors.length === 1,
    "Contributor list must include created contributor."
  )

  const summary = await getContributorSummary({ repository, workspaceId })
  assert(summary.ok, "Contributor summary shape must succeed.")
  assert(summary.ok && summary.data.totalContributors === 1, "Summary must count contributors.")
  assert(summary.ok && summary.data.byRole.composer === 1, "Summary must count roles.")
  assert(
    summary.ok && summary.data.flags.productionActivation === false,
    "Summary must not activate production."
  )
  assert(
    summary.ok &&
      summary.data.warnings.some((warning) =>
        warning.includes("Song/submission/evidence workflows remain TEST-only")
      ),
    "Summary must include TEST-only warning."
  )

  console.log("Contributor admin tests passed")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
