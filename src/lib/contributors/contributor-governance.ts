import { buildOperationalAuditEvent } from "@/lib/audit/operational-audit-event-builder"
import { buildLifecycleEvent } from "@/lib/workflow/lifecycle-event-builder"

export const CONTRIBUTOR_GOVERNANCE_TEST_MODE = "TEST_INTERNAL_ADMIN_ONLY"

export const contributorTypes = ["person", "company", "group", "unknown"] as const

export const contributorRoles = [
  "songwriter",
  "composer",
  "producer",
  "engineer",
  "performer",
  "publisher",
  "label",
  "manager",
  "other",
] as const

export const contributorVerificationStatuses = [
  "unverified",
  "invited",
  "pending",
  "verified",
  "rejected",
] as const

export const splitLinkedEntityTypes = [
  "song",
  "work",
  "recording",
  "submission",
] as const

export const splitTypes = [
  "ownership",
  "publishing",
  "composer",
  "lyric",
  "master",
  "performance",
  "other",
] as const

export type ContributorType = (typeof contributorTypes)[number]
export type ContributorRole = (typeof contributorRoles)[number]
export type ContributorVerificationStatus =
  (typeof contributorVerificationStatuses)[number]
export type SplitLinkedEntityType = (typeof splitLinkedEntityTypes)[number]
export type SplitType = (typeof splitTypes)[number]

export type ContributorIdentity = {
  contributorId: string
  workspaceId: string
  displayName: string
  legalName: string | null
  email: string | null
  contributorType: ContributorType
  roles: ContributorRole[]
  ipiCae: string | null
  proAffiliation: string | null
  country: string | null
  verificationStatus: ContributorVerificationStatus
  metadata: Record<string, unknown>
  auditEvent: Record<string, unknown>
  lifecycleEvent: Record<string, unknown>
  mode: typeof CONTRIBUTOR_GOVERNANCE_TEST_MODE
  productionActivation: false
  createdAt: string
}

export type ContributorCreateInput = {
  workspaceId?: string | null
  contributorId?: string | null
  displayName?: string | null
  legalName?: string | null
  email?: string | null
  contributorType?: string | null
  roles?: string[]
  ipiCae?: string | null
  proAffiliation?: string | null
  country?: string | null
  verificationStatus?: string | null
  metadata?: Record<string, unknown>
  createdAt?: string
}

export type SplitInput = {
  contributorId?: string | null
  role?: string | null
  splitType?: string | null
  percentage?: number | null
}

export type SplitValidationInput = {
  workspaceId?: string | null
  linkedEntityType?: string | null
  linkedEntityId?: string | null
  splits?: SplitInput[]
}

export type SplitValidation = {
  workspaceId: string
  linkedEntityType: SplitLinkedEntityType
  linkedEntityId: string
  splitType: SplitType | null
  totalPercentage: number
  contributorCount: number
  ready: boolean
  valid: boolean
  state: "ready" | "draft_incomplete" | "blocked"
  issues: string[]
  warnings: string[]
  mode: typeof CONTRIBUTOR_GOVERNANCE_TEST_MODE
  productionActivation: false
}

export type ContributorBuildResult =
  | { ok: true; contributor: ContributorIdentity }
  | { ok: false; error: { code: string; message: string } }

export type SplitValidationResult =
  | { ok: true; validation: SplitValidation }
  | { ok: false; error: { code: string; message: string } }

export function buildContributorIdentity(
  input: ContributorCreateInput
): ContributorBuildResult {
  const workspaceId = normalizeRequiredString(input.workspaceId)
  const displayName = normalizeRequiredString(input.displayName)
  const contributorType = input.contributorType?.trim() || "unknown"
  const verificationStatus = input.verificationStatus?.trim() || "unverified"
  const createdAt = input.createdAt ?? new Date().toISOString()

  if (!workspaceId) return failContributor("WORKSPACE_ID_REQUIRED", "workspace_id is required.")
  if (!displayName) return failContributor("DISPLAY_NAME_REQUIRED", "display_name is required.")
  if (!isContributorType(contributorType)) {
    return failContributor("INVALID_CONTRIBUTOR_TYPE", "contributor_type is not allowed.")
  }
  if (!isContributorVerificationStatus(verificationStatus)) {
    return failContributor(
      "INVALID_VERIFICATION_STATUS",
      "verification_status is not allowed."
    )
  }
  if (Number.isNaN(new Date(createdAt).getTime())) {
    return failContributor("INVALID_CREATED_AT", "created_at must be a valid date.")
  }

  const roles = normalizeRoles(input.roles)
  if (!roles.ok) return roles

  const contributorId =
    normalizeRequiredString(input.contributorId) ??
    `contributor_${crypto.randomUUID()}`
  const auditEvent = buildOperationalAuditEvent({
    eventId: `contributor_audit_${contributorId}`,
    workspaceId,
    action: "contributor.created",
    resourceType: "contributor",
    resourceId: contributorId,
    resourceLabel: displayName,
    category: "contributor",
    severity: verificationStatus === "rejected" ? "warning" : "info",
    status: verificationStatus === "rejected" ? "blocked" : "success",
    metadata: {
      roles: roles.roles,
      contributorType,
      verificationStatus,
      productionActivation: false,
    },
    occurredAt: createdAt,
  })
  const lifecycleEvent = buildLifecycleEvent({
    eventId: `contributor_lifecycle_${contributorId}`,
    workspaceId,
    entityType: "contributor",
    entityId: contributorId,
    currentState: "created",
    nextState: verificationStatus === "rejected" ? "blocked" : "updated",
    transitionKey: "contributor.created",
    metadata: {
      roles: roles.roles,
      contributorType,
      verificationStatus,
      productionActivation: false,
    },
    occurredAt: createdAt,
  })

  if (!auditEvent.ok) return failContributor("AUDIT_EVENT_BUILD_FAILED", auditEvent.error.message)
  if (!lifecycleEvent.ok) {
    return failContributor("LIFECYCLE_EVENT_BUILD_FAILED", lifecycleEvent.error.message)
  }

  return {
    ok: true,
    contributor: {
      contributorId,
      workspaceId,
      displayName,
      legalName: normalizeRequiredString(input.legalName),
      email: normalizeRequiredString(input.email),
      contributorType,
      roles: roles.roles,
      ipiCae: normalizeRequiredString(input.ipiCae),
      proAffiliation: normalizeRequiredString(input.proAffiliation),
      country: normalizeRequiredString(input.country)?.toUpperCase() ?? null,
      verificationStatus,
      metadata: {
        ...(input.metadata ?? {}),
        routeMode: CONTRIBUTOR_GOVERNANCE_TEST_MODE,
        productionActivation: false,
      },
      auditEvent: auditEvent.event,
      lifecycleEvent: lifecycleEvent.event,
      mode: CONTRIBUTOR_GOVERNANCE_TEST_MODE,
      productionActivation: false,
      createdAt,
    },
  }
}

export function validateSplits(input: SplitValidationInput): SplitValidationResult {
  const workspaceId = normalizeRequiredString(input.workspaceId)
  const linkedEntityType = input.linkedEntityType?.trim()
  const linkedEntityId = normalizeRequiredString(input.linkedEntityId)
  const splits = input.splits ?? []

  if (!workspaceId) return failSplit("WORKSPACE_ID_REQUIRED", "workspace_id is required.")
  if (!linkedEntityType || !isSplitLinkedEntityType(linkedEntityType)) {
    return failSplit("INVALID_LINKED_ENTITY_TYPE", "linked_entity_type is not allowed.")
  }
  if (!linkedEntityId) return failSplit("LINKED_ENTITY_ID_REQUIRED", "linked_entity_id is required.")
  if (!Array.isArray(splits)) return failSplit("INVALID_SPLITS", "splits must be an array.")

  const issues: string[] = []
  const warnings = contributorWarnings()
  let totalPercentage = 0
  let splitType: SplitType | null = null

  if (splits.length === 0) {
    issues.push("No splits supplied.")
  }

  for (const [index, split] of splits.entries()) {
    const contributorId = normalizeRequiredString(split.contributorId)
    const role = split.role?.trim()
    const currentSplitType = split.splitType?.trim()
    const percentage = Number(split.percentage)

    if (!contributorId) issues.push(`Split ${index + 1} contributor_id is required.`)
    if (!role || !isContributorRole(role)) {
      issues.push(`Split ${index + 1} role is not allowed.`)
    }
    if (!currentSplitType || !isSplitType(currentSplitType)) {
      issues.push(`Split ${index + 1} split_type is not allowed.`)
    } else {
      splitType = splitType ?? currentSplitType
      if (splitType !== currentSplitType) {
        issues.push("Mixed split_type values are not ready for governed validation.")
      }
    }
    if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
      issues.push(`Split ${index + 1} percentage must be between 0 and 100.`)
    } else {
      totalPercentage += percentage
    }
  }

  const incomplete = issues.length > 0
  const requiresTotal100 = splitType === "ownership" || splitType === "publishing"
  if (!incomplete && requiresTotal100 && roundPercentage(totalPercentage) !== 100) {
    issues.push("Split total must equal 100 for ownership/publishing validation.")
  }

  const valid = issues.length === 0
  return {
    ok: true,
    validation: {
      workspaceId,
      linkedEntityType,
      linkedEntityId,
      splitType,
      totalPercentage: roundPercentage(totalPercentage),
      contributorCount: splits.length,
      ready: valid,
      valid,
      state: valid ? "ready" : incomplete ? "draft_incomplete" : "blocked",
      issues,
      warnings,
      mode: CONTRIBUTOR_GOVERNANCE_TEST_MODE,
      productionActivation: false,
    },
  }
}

export function isContributorType(value: string): value is ContributorType {
  return contributorTypes.includes(value as ContributorType)
}

export function isContributorRole(value: string): value is ContributorRole {
  return contributorRoles.includes(value as ContributorRole)
}

export function isContributorVerificationStatus(
  value: string
): value is ContributorVerificationStatus {
  return contributorVerificationStatuses.includes(
    value as ContributorVerificationStatus
  )
}

export function isSplitLinkedEntityType(
  value: string
): value is SplitLinkedEntityType {
  return splitLinkedEntityTypes.includes(value as SplitLinkedEntityType)
}

export function isSplitType(value: string): value is SplitType {
  return splitTypes.includes(value as SplitType)
}

export function contributorWarnings(): string[] {
  return [
    "TEST/internal/admin support only.",
    "Contributor governance does not alter production contributor/song routes.",
    "Split validation does not activate production readiness enforcement.",
    "Song/submission/evidence workflows remain TEST-only.",
  ]
}

export function normalizeRequiredString(value?: string | null): string | null {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

function normalizeRoles(inputRoles?: string[]): ContributorBuildResult | { ok: true; roles: ContributorRole[] } {
  const roles = inputRoles?.length ? inputRoles : ["other"]
  const normalized: ContributorRole[] = []

  for (const role of roles) {
    const value = role.trim()
    if (!isContributorRole(value)) {
      return failContributor("INVALID_CONTRIBUTOR_ROLE", "Contributor role is not allowed.")
    }
    normalized.push(value)
  }

  return { ok: true, roles: Array.from(new Set(normalized)) }
}

function roundPercentage(value: number): number {
  return Math.round(value * 100) / 100
}

function failContributor(code: string, message: string): ContributorBuildResult {
  return { ok: false, error: { code, message } }
}

function failSplit(code: string, message: string): SplitValidationResult {
  return { ok: false, error: { code, message } }
}
