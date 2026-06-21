export const EVIDENCE_READINESS_TEST_MODE = "TEST_INTERNAL_ADMIN_ONLY"

export const evidenceRequirementKeys = [
  "contributor_presence",
  "split_validity",
  "asset_reference",
  "evidence_file_reference",
  "lifecycle_governance",
  "audit_governance",
] as const

export const evidenceRequirementCategories = [
  "contributor",
  "split",
  "asset",
  "evidence",
  "lifecycle",
  "governance",
] as const

export type EvidenceRequirementKey = (typeof evidenceRequirementKeys)[number]
export type EvidenceRequirementCategory =
  (typeof evidenceRequirementCategories)[number]

export type EvidenceReadinessStatus =
  | "unavailable"
  | "blocked"
  | "not_ready"
  | "ready_for_review"

export type EvidenceComplianceStatus =
  | "unavailable"
  | "missing_required_evidence"
  | "blocked"
  | "test_review_ready"

export type EvidenceReadinessActivity = {
  id: string
  workspaceId: string
  activityType: string
  entityType: string | null
  entityId: string | null
  metadata: Record<string, unknown>
  createdAt: string
}

export type EvidenceReadinessRepository = {
  listReadinessActivities(input: {
    workspaceId: string
    entityType?: string | null
    entityId?: string | null
    limit: number
  }): Promise<readonly EvidenceReadinessActivity[]>
}

export type EvidenceRequirementDefinition = {
  key: EvidenceRequirementKey
  category: EvidenceRequirementCategory
  label: string
  required: boolean
  blocking: boolean
  description: string
}

export type EvidenceRequirementResult = EvidenceRequirementDefinition & {
  satisfied: boolean
  status: "satisfied" | "missing" | "unavailable"
  source: string
  details: string
}

export type EvidenceReadinessBlocker = {
  code: EvidenceRequirementKey | "workspace_id_required"
  message: string
  blocking: true
}

export type MissingEvidenceItem = {
  requirementKey: EvidenceRequirementKey
  label: string
  reason: string
}

export type EvidenceReadinessSummary = {
  contributorCount: number
  splitReady: boolean
  assetReferenceCount: number
  evidenceFileCount: number
  lifecycleEventCount: number
  auditEventCount: number
  latestActivityAt: string | null
}

export type EvidenceSubmissionGate = {
  canQueueSubmission: false
  reason: string
}

export type EvidenceReadinessResult = {
  workspaceId: string
  entityType: string | null
  entityId: string | null
  readinessScore: number
  operationalReadinessStatus: EvidenceReadinessStatus
  complianceStatus: EvidenceComplianceStatus
  requirements: EvidenceRequirementResult[]
  missingEvidence: MissingEvidenceItem[]
  blockers: EvidenceReadinessBlocker[]
  summary: EvidenceReadinessSummary
  submissionGate: EvidenceSubmissionGate
  dashboardVisibility: {
    showReadinessCard: true
    showBlockers: boolean
    showMissingEvidence: boolean
  }
  flags: EvidenceReadinessFlags
  warnings: string[]
}

export type EvidenceReadinessFlags = {
  mode: typeof EVIDENCE_READINESS_TEST_MODE
  testInternalAdminOnly: true
  productionActivation: false
  readModelOnly: true
  productionEvidenceGovernance: false
}

export type EvidenceReadinessResultEnvelope<T> =
  | { ok: true; mode: typeof EVIDENCE_READINESS_TEST_MODE; data: T }
  | {
      ok: false
      mode: typeof EVIDENCE_READINESS_TEST_MODE
      error: { code: string; message: string }
    }

export const canonicalEvidenceRequirements: EvidenceRequirementDefinition[] = [
  {
    key: "contributor_presence",
    category: "contributor",
    label: "Contributor presence",
    required: true,
    blocking: true,
    description: "At least one contributor must be present in the operational graph.",
  },
  {
    key: "split_validity",
    category: "split",
    label: "Split validity",
    required: true,
    blocking: true,
    description: "Current split governance must indicate a valid split state.",
  },
  {
    key: "asset_reference",
    category: "asset",
    label: "Asset reference",
    required: true,
    blocking: false,
    description: "At least one song/file asset reference should be present.",
  },
  {
    key: "evidence_file_reference",
    category: "evidence",
    label: "Evidence file reference",
    required: true,
    blocking: true,
    description: "At least one evidence file or evidence-class asset must be present.",
  },
  {
    key: "lifecycle_governance",
    category: "lifecycle",
    label: "Lifecycle governance",
    required: true,
    blocking: false,
    description: "At least one lifecycle event should exist for operational traceability.",
  },
  {
    key: "audit_governance",
    category: "governance",
    label: "Audit governance",
    required: true,
    blocking: false,
    description: "At least one operational audit event should exist for accountability.",
  },
]

export function evidenceReadinessFlags(): EvidenceReadinessFlags {
  return {
    mode: EVIDENCE_READINESS_TEST_MODE,
    testInternalAdminOnly: true,
    productionActivation: false,
    readModelOnly: true,
    productionEvidenceGovernance: false,
  }
}

export function evidenceReadinessWarnings(): string[] {
  return [
    "TEST/internal/admin support only.",
    "Evidence readiness is a read-model aggregation over existing operational metadata.",
    "This does not create a separate evidence engine or production evidence governance.",
    "Submission gating remains blocked for production routes.",
    "Song/submission/evidence workflows remain TEST-only.",
  ]
}

export function normalizeEvidenceReadinessLimit(limit?: number): number {
  if (!Number.isFinite(limit) || !limit) return 100
  return Math.min(Math.max(Math.trunc(limit), 1), 250)
}

export function normalizeOptionalString(value?: string | null): string | null {
  const normalized = value?.trim()
  return normalized ? normalized : null
}
