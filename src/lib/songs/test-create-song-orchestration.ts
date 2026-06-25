import { buildOperationalAuditEvent } from "@/lib/audit/operational-audit-event-builder"
import {
  buildContributorIdentity,
  validateSplits,
} from "@/lib/contributors/contributor-governance"
import { buildLifecycleEvent } from "@/lib/workflow/lifecycle-event-builder"

export const TEST_CREATE_SONG_ORCHESTRATION_MODE = "TEST_INTERNAL_ADMIN_ONLY"

export type TestCreateSongContributorInput = {
  contributor_id?: string | null
  display_name?: string | null
  legal_name?: string | null
  email?: string | null
  contributor_type?: string | null
  roles?: string[]
  ipi_cae?: string | null
  pro_affiliation?: string | null
  country?: string | null
  verification_status?: string | null
  metadata?: Record<string, unknown>
}

export type TestCreateSongSplitInput = {
  contributor_id?: string | null
  role?: string | null
  split_type?: string | null
  percentage?: number | null
}

export type TestCreateSongAssetReferenceInput = {
  asset_id?: string | null
  asset_type?: string | null
  asset_category?: string | null
  title?: string | null
  storage_path?: string | null
  linked_role?: string | null
  metadata?: Record<string, unknown>
}

export type TestCreateSongOrchestrationInput = {
  workspace_id?: string | null
  title?: string | null
  alternative_titles?: string[]
  isrc?: string | null
  iswc?: string | null
  genre?: string | null
  language?: string | null
  duration_seconds?: number | null
  release_date?: string | null
  contributors?: TestCreateSongContributorInput[]
  splits?: TestCreateSongSplitInput[]
  asset_references?: TestCreateSongAssetReferenceInput[]
  metadata?: Record<string, unknown>
  actor_user_id?: string | null
}

export type TestSongDraftSummary = {
  songId: string
  workspaceId: string
  title: string
  alternativeTitles: string[]
  isrc: string | null
  iswc: string | null
  genre: string | null
  language: string | null
  durationSeconds: number | null
  releaseDate: string | null
  metadata: Record<string, unknown>
  mode: typeof TEST_CREATE_SONG_ORCHESTRATION_MODE
  productionActivation: false
}

export type TestCreateSongOrchestrationRecord = {
  orchestrationId: string
  songDraftSummary: TestSongDraftSummary
  contributorValidation: {
    valid: boolean
    contributorCount: number
    contributors: unknown[]
    issues: string[]
  }
  splitValidation: unknown
  assetReferenceSummary: {
    assetCount: number
    assets: TestCreateSongAssetReferenceInput[]
    warnings: string[]
  }
  lifecycleEventSummary: unknown
  auditEventSummary: unknown
  readinessPlaceholder: {
    state: "not_ready" | "draft_only" | "ready_for_review"
    productionReady: false
    reason: string
  }
  warnings: string[]
  mode: typeof TEST_CREATE_SONG_ORCHESTRATION_MODE
  productionActivation: false
}

export type TestCreateSongOrchestrationRepository = {
  recordOrchestration(
    record: TestCreateSongOrchestrationRecord
  ): Promise<TestCreateSongOrchestrationRecord>
}

export type TestCreateSongOrchestrationResult =
  | {
      ok: true
      mode: typeof TEST_CREATE_SONG_ORCHESTRATION_MODE
      data: TestCreateSongOrchestrationRecord
    }
  | {
      ok: false
      mode: typeof TEST_CREATE_SONG_ORCHESTRATION_MODE
      error: {
        code: string
        message: string
        details?: unknown
      }
    }

export async function orchestrateTestCreateSong(input: {
  repository: TestCreateSongOrchestrationRepository
  payload: TestCreateSongOrchestrationInput
  now?: Date
}): Promise<TestCreateSongOrchestrationResult> {
  const metadata = validateSongMetadata(input.payload)
  if (!metadata.ok) return metadata

  const now = input.now ?? new Date()
  const songId = `test_song_${crypto.randomUUID()}`
  const orchestrationId = `test_song_orchestration_${crypto.randomUUID()}`
  const contributorValidation = validateContributors({
    workspaceId: metadata.data.workspaceId,
    contributors: input.payload.contributors ?? [],
    now,
  })

  if (!contributorValidation.valid) {
    return fail(
      "CONTRIBUTOR_VALIDATION_FAILED",
      "Contributor validation failed.",
      contributorValidation
    )
  }

  const splitValidation = validateSplits({
    workspaceId: metadata.data.workspaceId,
    linkedEntityType: "song",
    linkedEntityId: songId,
    splits: (input.payload.splits ?? []).map((split) => ({
      contributorId: split.contributor_id,
      role: split.role,
      splitType: split.split_type,
      percentage: split.percentage,
    })),
  })

  if (!splitValidation.ok) {
    return fail(splitValidation.error.code, splitValidation.error.message)
  }

  if (!splitValidation.validation.valid) {
    return fail(
      "SPLIT_VALIDATION_FAILED",
      "Split validation failed.",
      splitValidation.validation
    )
  }

  const songDraftSummary: TestSongDraftSummary = {
    songId,
    workspaceId: metadata.data.workspaceId,
    title: metadata.data.title,
    alternativeTitles: metadata.data.alternativeTitles,
    isrc: metadata.data.isrc,
    iswc: metadata.data.iswc,
    genre: metadata.data.genre,
    language: metadata.data.language,
    durationSeconds: metadata.data.durationSeconds,
    releaseDate: metadata.data.releaseDate,
    metadata: metadata.data.metadata,
    mode: TEST_CREATE_SONG_ORCHESTRATION_MODE,
    productionActivation: false,
  }
  const assetReferenceSummary = buildAssetReferenceSummary(
    input.payload.asset_references ?? []
  )
  const readinessPlaceholder = buildReadinessPlaceholder({
    contributorCount: contributorValidation.contributorCount,
    splitReady: splitValidation.validation.ready,
    assetCount: assetReferenceSummary.assetCount,
  })
  const lifecycleEvent = buildLifecycleEvent({
    eventId: `test_song_lifecycle_${songId}`,
    workspaceId: metadata.data.workspaceId,
    entityType: "song",
    entityId: songId,
    currentState: "draft",
    nextState: "metadata_started",
    transitionKey: "test_create_song_orchestration.metadata_started",
    actorUserId: input.payload.actor_user_id,
    reason: "TEST create song orchestration draft created",
    metadata: {
      orchestrationId,
      readinessPlaceholder,
      productionActivation: false,
    },
    occurredAt: now.toISOString(),
  })

  if (!lifecycleEvent.ok) {
    return fail("LIFECYCLE_EVENT_BUILD_FAILED", lifecycleEvent.error.message)
  }

  const auditEvent = buildOperationalAuditEvent({
    eventId: `test_song_audit_${songId}`,
    workspaceId: metadata.data.workspaceId,
    actorUserId: input.payload.actor_user_id,
    action: "test_song.create_orchestration",
    resourceType: "song",
    resourceId: songId,
    resourceLabel: metadata.data.title,
    category: "song",
    severity: readinessPlaceholder.state === "ready_for_review" ? "info" : "warning",
    status: readinessPlaceholder.state === "not_ready" ? "blocked" : "success",
    metadata: {
      orchestrationId,
      readinessPlaceholder,
      productionActivation: false,
    },
    occurredAt: now.toISOString(),
  })

  if (!auditEvent.ok) {
    return fail("AUDIT_EVENT_BUILD_FAILED", auditEvent.error.message)
  }

  const record: TestCreateSongOrchestrationRecord = {
    orchestrationId,
    songDraftSummary,
    contributorValidation,
    splitValidation: splitValidation.validation,
    assetReferenceSummary,
    lifecycleEventSummary: lifecycleEvent.event,
    auditEventSummary: auditEvent.event,
    readinessPlaceholder,
    warnings: testCreateSongWarnings(),
    mode: TEST_CREATE_SONG_ORCHESTRATION_MODE,
    productionActivation: false,
  }

  const persisted = await input.repository.recordOrchestration(record)
  return succeed(persisted)
}

function validateSongMetadata(payload: TestCreateSongOrchestrationInput):
  | {
      ok: true
      data: {
        workspaceId: string
        title: string
        alternativeTitles: string[]
        isrc: string | null
        iswc: string | null
        genre: string | null
        language: string | null
        durationSeconds: number | null
        releaseDate: string | null
        metadata: Record<string, unknown>
      }
    }
  | TestCreateSongOrchestrationResult {
  const workspaceId = normalizeRequiredString(payload.workspace_id)
  const title = normalizeRequiredString(payload.title)

  if (!workspaceId) return fail("WORKSPACE_ID_REQUIRED", "workspace_id is required.")
  if (!title) return fail("TITLE_REQUIRED", "title is required.")

  if (
    payload.duration_seconds !== null &&
    payload.duration_seconds !== undefined &&
    (!Number.isFinite(payload.duration_seconds) || payload.duration_seconds < 0)
  ) {
    return fail("INVALID_DURATION", "duration_seconds must be a positive number.")
  }

  if (
    payload.release_date &&
    Number.isNaN(new Date(payload.release_date).getTime())
  ) {
    return fail("INVALID_RELEASE_DATE", "release_date must be a valid date.")
  }

  return {
    ok: true,
    data: {
      workspaceId,
      title,
      alternativeTitles: Array.isArray(payload.alternative_titles)
        ? payload.alternative_titles
            .map((title) => title.trim())
            .filter(Boolean)
        : [],
      isrc: normalizeRequiredString(payload.isrc),
      iswc: normalizeRequiredString(payload.iswc),
      genre: normalizeRequiredString(payload.genre),
      language: normalizeRequiredString(payload.language),
      durationSeconds: payload.duration_seconds ?? null,
      releaseDate: normalizeRequiredString(payload.release_date),
      metadata: {
        ...(payload.metadata ?? {}),
        routeMode: TEST_CREATE_SONG_ORCHESTRATION_MODE,
        productionActivation: false,
      },
    },
  }
}

function validateContributors(input: {
  workspaceId: string
  contributors: TestCreateSongContributorInput[]
  now: Date
}): TestCreateSongOrchestrationRecord["contributorValidation"] {
  const contributors: unknown[] = []
  const issues: string[] = []

  for (const [index, contributor] of input.contributors.entries()) {
    const built = buildContributorIdentity({
      workspaceId: input.workspaceId,
      contributorId: contributor.contributor_id,
      displayName: contributor.display_name,
      legalName: contributor.legal_name,
      email: contributor.email,
      contributorType: contributor.contributor_type,
      roles: contributor.roles,
      ipiCae: contributor.ipi_cae,
      proAffiliation: contributor.pro_affiliation,
      country: contributor.country,
      verificationStatus: contributor.verification_status,
      metadata: contributor.metadata,
      createdAt: input.now.toISOString(),
    })

    if (!built.ok) {
      issues.push(`Contributor ${index + 1}: ${built.error.message}`)
    } else {
      contributors.push(built.contributor)
    }
  }

  if (input.contributors.length === 0) {
    issues.push("At least one contributor is required for TEST orchestration.")
  }

  return {
    valid: issues.length === 0,
    contributorCount: contributors.length,
    contributors,
    issues,
  }
}

function buildAssetReferenceSummary(
  assets: TestCreateSongAssetReferenceInput[]
): TestCreateSongOrchestrationRecord["assetReferenceSummary"] {
  const warnings: string[] = []
  const normalized = assets.map((asset, index) => {
    if (!normalizeRequiredString(asset.asset_id)) {
      warnings.push(`Asset reference ${index + 1} has no asset_id.`)
    }
    return asset
  })

  return {
    assetCount: normalized.length,
    assets: normalized,
    warnings,
  }
}

function buildReadinessPlaceholder(input: {
  contributorCount: number
  splitReady: boolean
  assetCount: number
}): TestCreateSongOrchestrationRecord["readinessPlaceholder"] {
  if (!input.splitReady || input.contributorCount === 0) {
    return {
      state: "not_ready",
      productionReady: false,
      reason: "Contributor and split validation must pass before review.",
    }
  }

  if (input.assetCount === 0) {
    return {
      state: "draft_only",
      productionReady: false,
      reason: "Draft is valid for TEST orchestration, but no asset references were supplied.",
    }
  }

  return {
    state: "ready_for_review",
    productionReady: false,
    reason: "TEST draft can move to mock review; this is not production readiness.",
  }
}

export function testCreateSongWarnings(): string[] {
  return [
    "TEST/internal/admin support only.",
    "Does not call or replace POST /api/songs/create.",
    "Readiness is a placeholder and not production readiness.",
    "Song/submission/evidence workflows remain TEST-only.",
  ]
}

function normalizeRequiredString(value?: string | null): string | null {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

function succeed(
  data: TestCreateSongOrchestrationRecord
): TestCreateSongOrchestrationResult {
  return {
    ok: true,
    mode: TEST_CREATE_SONG_ORCHESTRATION_MODE,
    data,
  }
}

function fail(
  code: string,
  message: string,
  details?: unknown
): TestCreateSongOrchestrationResult {
  return {
    ok: false,
    mode: TEST_CREATE_SONG_ORCHESTRATION_MODE,
    error: { code, message, details },
  }
}
