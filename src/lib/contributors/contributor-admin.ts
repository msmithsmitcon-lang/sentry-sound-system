import {
  CONTRIBUTOR_GOVERNANCE_TEST_MODE,
  ContributorCreateInput,
  ContributorIdentity,
  SplitValidation,
  SplitValidationInput,
  buildContributorIdentity,
  contributorRoles,
  contributorVerificationStatuses,
  contributorWarnings,
  contributorTypes,
  normalizeRequiredString,
  validateSplits,
} from "./contributor-governance"

export type ContributorAdminRepository = {
  listContributors(input: {
    workspaceId: string
    limit: number
  }): Promise<readonly ContributorIdentity[]>
  createContributor(contributor: ContributorIdentity): Promise<ContributorIdentity>
}

export type ContributorAdminResult<T> =
  | { ok: true; mode: typeof CONTRIBUTOR_GOVERNANCE_TEST_MODE; data: T }
  | {
      ok: false
      mode: typeof CONTRIBUTOR_GOVERNANCE_TEST_MODE
      error: { code: string; message: string }
    }

export type ContributorSummary = {
  workspaceId: string
  totalContributors: number
  byType: Record<string, number>
  byRole: Record<string, number>
  byVerificationStatus: Record<string, number>
  warnings: string[]
  flags: {
    mode: typeof CONTRIBUTOR_GOVERNANCE_TEST_MODE
    testInternalAdminOnly: true
    productionActivation: false
    productionContributorGovernance: false
  }
}

export async function listContributors(input: {
  repository: ContributorAdminRepository
  workspaceId?: string | null
  limit?: number
}): Promise<ContributorAdminResult<{ contributors: readonly ContributorIdentity[]; warnings: string[] }>> {
  const workspaceId = normalizeRequiredString(input.workspaceId)
  if (!workspaceId) return fail("WORKSPACE_ID_REQUIRED", "workspace_id is required.")

  const contributors = await input.repository.listContributors({
    workspaceId,
    limit: normalizeLimit(input.limit),
  })
  return succeed({ contributors, warnings: contributorWarnings() })
}

export async function createContributor(input: {
  repository: ContributorAdminRepository
  contributor: ContributorCreateInput
}): Promise<ContributorAdminResult<{ contributor: ContributorIdentity; warnings: string[] }>> {
  const built = buildContributorIdentity(input.contributor)
  if (!built.ok) return fail(built.error.code, built.error.message)

  const contributor = await input.repository.createContributor(built.contributor)
  return succeed({ contributor, warnings: contributorWarnings() })
}

export async function getContributorSummary(input: {
  repository: ContributorAdminRepository
  workspaceId?: string | null
  limit?: number
}): Promise<ContributorAdminResult<ContributorSummary>> {
  const listed = await listContributors(input)
  if (!listed.ok) return listed
  return succeed(
    buildContributorSummary({
      workspaceId: normalizeRequiredString(input.workspaceId) ?? "",
      contributors: listed.data.contributors,
    })
  )
}

export function validateContributorSplits(input: SplitValidationInput): ContributorAdminResult<SplitValidation> {
  const result = validateSplits(input)
  if (!result.ok) return fail(result.error.code, result.error.message)
  return succeed(result.validation)
}

export function buildContributorSummary(input: {
  workspaceId: string
  contributors: readonly ContributorIdentity[]
}): ContributorSummary {
  const byType = Object.fromEntries(contributorTypes.map((key) => [key, 0]))
  const byRole = Object.fromEntries(contributorRoles.map((key) => [key, 0]))
  const byVerificationStatus = Object.fromEntries(
    contributorVerificationStatuses.map((key) => [key, 0])
  )

  for (const contributor of input.contributors) {
    byType[contributor.contributorType] += 1
    byVerificationStatus[contributor.verificationStatus] += 1
    for (const role of contributor.roles) {
      byRole[role] += 1
    }
  }

  return {
    workspaceId: input.workspaceId,
    totalContributors: input.contributors.length,
    byType,
    byRole,
    byVerificationStatus,
    warnings: contributorWarnings(),
    flags: {
      mode: CONTRIBUTOR_GOVERNANCE_TEST_MODE,
      testInternalAdminOnly: true,
      productionActivation: false,
      productionContributorGovernance: false,
    },
  }
}

function normalizeLimit(limit?: number): number {
  if (!Number.isFinite(limit) || !limit) return 50
  return Math.min(Math.max(Math.trunc(limit), 1), 100)
}

function succeed<T>(data: T): ContributorAdminResult<T> {
  return { ok: true, mode: CONTRIBUTOR_GOVERNANCE_TEST_MODE, data }
}

function fail<T = never>(code: string, message: string): ContributorAdminResult<T> {
  return {
    ok: false,
    mode: CONTRIBUTOR_GOVERNANCE_TEST_MODE,
    error: { code, message },
  }
}
