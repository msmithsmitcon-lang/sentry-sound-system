import {
  EVIDENCE_READINESS_TEST_MODE,
  EvidenceReadinessActivity,
  EvidenceReadinessRepository,
  EvidenceReadinessResult,
  EvidenceReadinessResultEnvelope,
  canonicalEvidenceRequirements,
  evidenceReadinessFlags,
  evidenceReadinessWarnings,
  normalizeEvidenceReadinessLimit,
  normalizeOptionalString,
} from "./evidence-readiness"

type OperationalFacts = {
  contributorCount: number
  splitReady: boolean
  assetReferenceCount: number
  evidenceFileCount: number
  lifecycleEventCount: number
  auditEventCount: number
  latestActivityAt: string | null
}

export async function getEvidenceReadiness(input: {
  repository: EvidenceReadinessRepository
  workspaceId?: string | null
  entityType?: string | null
  entityId?: string | null
  limit?: number
}): Promise<EvidenceReadinessResultEnvelope<EvidenceReadinessResult>> {
  const workspaceId = normalizeOptionalString(input.workspaceId)
  if (!workspaceId) return fail("WORKSPACE_ID_REQUIRED", "workspace_id is required.")

  const activities = await input.repository.listReadinessActivities({
    workspaceId,
    entityType: normalizeOptionalString(input.entityType),
    entityId: normalizeOptionalString(input.entityId),
    limit: normalizeEvidenceReadinessLimit(input.limit),
  })

  return succeed(
    aggregateEvidenceReadiness({
      workspaceId,
      entityType: normalizeOptionalString(input.entityType),
      entityId: normalizeOptionalString(input.entityId),
      activities,
    })
  )
}

export async function getEvidenceReadinessSummary(input: {
  repository: EvidenceReadinessRepository
  workspaceId?: string | null
  limit?: number
}): Promise<
  EvidenceReadinessResultEnvelope<{
    workspaceId: string
    readiness: EvidenceReadinessResult
    warnings: string[]
  }>
> {
  const result = await getEvidenceReadiness({
    repository: input.repository,
    workspaceId: input.workspaceId,
    limit: input.limit,
  })

  if (!result.ok) return result

  return succeed({
    workspaceId: result.data.workspaceId,
    readiness: result.data,
    warnings: evidenceReadinessWarnings(),
  })
}

export function aggregateEvidenceReadiness(input: {
  workspaceId: string
  entityType?: string | null
  entityId?: string | null
  activities: readonly EvidenceReadinessActivity[]
}): EvidenceReadinessResult {
  const scopedActivities = filterActivitiesForScope(input.activities, {
    entityType: input.entityType,
    entityId: input.entityId,
  })
  const facts = extractOperationalFacts(scopedActivities)
  const requirements = canonicalEvidenceRequirements.map((requirement) => {
    const satisfied = isRequirementSatisfied(requirement.key, facts)
    return {
      ...requirement,
      satisfied,
      status: satisfied ? "satisfied" : "missing",
      source: "operational_metadata_read_model",
      details: satisfied
        ? `${requirement.label} satisfied from existing operational graph metadata.`
        : `${requirement.label} is not available in existing operational graph metadata.`,
    } as const
  })

  const missingEvidence = requirements
    .filter((requirement) => requirement.category === "evidence" && !requirement.satisfied)
    .map((requirement) => ({
      requirementKey: requirement.key,
      label: requirement.label,
      reason: requirement.details,
    }))

  const blockers = requirements
    .filter((requirement) => requirement.blocking && !requirement.satisfied)
    .map((requirement) => ({
      code: requirement.key,
      message: requirement.details,
      blocking: true as const,
    }))

  const readinessScore = calculateReadinessScore(requirements)
  const operationalReadinessStatus =
    blockers.length > 0
      ? "blocked"
      : readinessScore === 100
        ? "ready_for_review"
        : "not_ready"
  const complianceStatus =
    missingEvidence.length > 0
      ? "missing_required_evidence"
      : blockers.length > 0
        ? "blocked"
        : "test_review_ready"

  return {
    workspaceId: input.workspaceId,
    entityType: input.entityType ?? null,
    entityId: input.entityId ?? null,
    readinessScore,
    operationalReadinessStatus,
    complianceStatus,
    requirements,
    missingEvidence,
    blockers,
    summary: facts,
    submissionGate: {
      canQueueSubmission: false,
      reason:
        blockers.length > 0
          ? "Submission queueing is blocked by missing TEST evidence readiness requirements."
          : "Submission queueing remains disabled because this is TEST read-model output only.",
    },
    dashboardVisibility: {
      showReadinessCard: true,
      showBlockers: blockers.length > 0,
      showMissingEvidence: missingEvidence.length > 0,
    },
    flags: evidenceReadinessFlags(),
    warnings: evidenceReadinessWarnings(),
  }
}

function filterActivitiesForScope(
  activities: readonly EvidenceReadinessActivity[],
  scope: { entityType?: string | null; entityId?: string | null }
): readonly EvidenceReadinessActivity[] {
  if (!scope.entityId) return activities

  return activities.filter((activity) => {
    if (activity.entityId === scope.entityId) return true
    if (scope.entityType && activity.entityType === scope.entityType && !activity.entityId) {
      return true
    }

    const orchestration = readRecord(
      activity.metadata.testCreateSongOrchestration
    )
    const songDraft = readRecord(orchestration?.songDraftSummary)
    if (songDraft?.songId === scope.entityId) return true

    const assetEvent = readRecord(activity.metadata.assetEvent)
    return (
      assetEvent?.linkedEntityId === scope.entityId ||
      assetEvent?.linked_entity_id === scope.entityId
    )
  })
}

function extractOperationalFacts(
  activities: readonly EvidenceReadinessActivity[]
): OperationalFacts {
  const facts: OperationalFacts = {
    contributorCount: 0,
    splitReady: false,
    assetReferenceCount: 0,
    evidenceFileCount: 0,
    lifecycleEventCount: 0,
    auditEventCount: 0,
    latestActivityAt: null,
  }

  for (const activity of activities) {
    if (!facts.latestActivityAt || activity.createdAt > facts.latestActivityAt) {
      facts.latestActivityAt = activity.createdAt
    }

    const orchestration = readRecord(
      activity.metadata.testCreateSongOrchestration
    )
    const contributorEvent = readRecord(activity.metadata.contributorEvent)
    const assetEvent = readRecord(activity.metadata.assetEvent)
    const lifecycleEvent = readRecord(activity.metadata.lifecycleEvent)
    const auditEvent = readRecord(activity.metadata.operationalAuditEvent)

    if (orchestration) {
      facts.contributorCount = Math.max(
        facts.contributorCount,
        readNumber(readRecord(orchestration.contributorValidation)?.contributorCount)
      )
      facts.splitReady =
        facts.splitReady ||
        readRecord(orchestration.splitValidation)?.ready === true ||
        readRecord(orchestration.splitValidation)?.valid === true

      const assetReferenceSummary = readRecord(
        orchestration.assetReferenceSummary
      )
      const assetCount = readNumber(assetReferenceSummary?.assetCount)
      facts.assetReferenceCount += assetCount
      facts.evidenceFileCount += countEvidenceAssets(
        readArray(assetReferenceSummary?.assets)
      )
    }

    if (contributorEvent) facts.contributorCount += 1

    if (assetEvent) {
      facts.assetReferenceCount += 1
      if (isEvidenceAsset(assetEvent)) facts.evidenceFileCount += 1
    }

    if (lifecycleEvent) facts.lifecycleEventCount += 1
    if (auditEvent) facts.auditEventCount += 1
  }

  return facts
}

function isRequirementSatisfied(
  key: string,
  facts: OperationalFacts
): boolean {
  switch (key) {
    case "contributor_presence":
      return facts.contributorCount > 0
    case "split_validity":
      return facts.splitReady
    case "asset_reference":
      return facts.assetReferenceCount > 0
    case "evidence_file_reference":
      return facts.evidenceFileCount > 0
    case "lifecycle_governance":
      return facts.lifecycleEventCount > 0
    case "audit_governance":
      return facts.auditEventCount > 0
    default:
      return false
  }
}

function calculateReadinessScore(
  requirements: readonly { required: boolean; satisfied: boolean }[]
): number {
  const required = requirements.filter((requirement) => requirement.required)
  if (required.length === 0) return 0
  const satisfied = required.filter((requirement) => requirement.satisfied)
  return Math.round((satisfied.length / required.length) * 100)
}

function countEvidenceAssets(assets: readonly unknown[]): number {
  return assets.filter((asset) => isEvidenceAsset(readRecord(asset))).length
}

function isEvidenceAsset(asset: Record<string, unknown> | null): boolean {
  if (!asset) return false
  return (
    asset.asset_type === "evidence" ||
    asset.assetType === "evidence" ||
    asset.asset_category === "evidence_file" ||
    asset.assetCategory === "evidence_file" ||
    asset.linked_role === "evidence" ||
    asset.linkedRole === "evidence" ||
    asset.linkedEntityType === "evidence" ||
    asset.linked_entity_type === "evidence"
  )
}

function readRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function readArray(value: unknown): readonly unknown[] {
  return Array.isArray(value) ? value : []
}

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0
}

function succeed<T>(data: T): EvidenceReadinessResultEnvelope<T> {
  return { ok: true, mode: EVIDENCE_READINESS_TEST_MODE, data }
}

function fail<T = never>(
  code: string,
  message: string
): EvidenceReadinessResultEnvelope<T> {
  return {
    ok: false,
    mode: EVIDENCE_READINESS_TEST_MODE,
    error: { code, message },
  }
}
