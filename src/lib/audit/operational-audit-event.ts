export const OPERATIONAL_AUDIT_TEST_MODE = "TEST_INTERNAL_ADMIN_ONLY"

export const operationalAuditCategories = [
  "auth",
  "workspace",
  "subscription",
  "song",
  "contributor",
  "evidence",
  "file",
  "submission",
  "system",
] as const

export const operationalAuditSeverities = [
  "info",
  "warning",
  "error",
  "security",
] as const

export const operationalAuditStatuses = [
  "success",
  "blocked",
  "failed",
  "pending",
] as const

export type OperationalAuditCategory =
  (typeof operationalAuditCategories)[number]

export type OperationalAuditSeverity =
  (typeof operationalAuditSeverities)[number]

export type OperationalAuditStatus = (typeof operationalAuditStatuses)[number]

export type OperationalAuditEvent = {
  eventId: string
  workspaceId: string
  actorUserId: string | null
  actorDisplayName: string | null
  actorEmail: string | null
  action: string
  resourceType: string
  resourceId: string | null
  resourceLabel: string | null
  category: OperationalAuditCategory
  severity: OperationalAuditSeverity
  status: OperationalAuditStatus
  ipAddress: string | null
  userAgent: string | null
  metadata: Record<string, unknown>
  occurredAt: string
  mode: typeof OPERATIONAL_AUDIT_TEST_MODE
  productionActivation: false
}

export type BuildOperationalAuditEventInput = {
  eventId?: string
  workspaceId?: string | null
  actorUserId?: string | null
  actorDisplayName?: string | null
  actorEmail?: string | null
  action?: string | null
  resourceType?: string | null
  resourceId?: string | null
  resourceLabel?: string | null
  category?: string | null
  severity?: string | null
  status?: string | null
  ipAddress?: string | null
  userAgent?: string | null
  metadata?: Record<string, unknown>
  occurredAt?: string
}

export type OperationalAuditEventBuildErrorCode =
  | "WORKSPACE_ID_REQUIRED"
  | "ACTION_REQUIRED"
  | "RESOURCE_TYPE_REQUIRED"
  | "INVALID_CATEGORY"
  | "INVALID_SEVERITY"
  | "INVALID_STATUS"
  | "INVALID_OCCURRED_AT"

export type OperationalAuditEventBuildResult =
  | {
      ok: true
      event: OperationalAuditEvent
    }
  | {
      ok: false
      error: {
        code: OperationalAuditEventBuildErrorCode
        message: string
      }
    }

export type OperationalAuditEventListInput = {
  workspaceId?: string | null
  limit?: number
}

export type OperationalAuditEventCreateInput = BuildOperationalAuditEventInput

export type OperationalAuditEventRepository = {
  listEvents(input: {
    workspaceId: string
    limit: number
  }): Promise<readonly OperationalAuditEvent[]>
  createEvent(event: OperationalAuditEvent): Promise<OperationalAuditEvent>
}

export type OperationalAuditEventResult<T> =
  | {
      ok: true
      mode: typeof OPERATIONAL_AUDIT_TEST_MODE
      data: T
    }
  | {
      ok: false
      mode: typeof OPERATIONAL_AUDIT_TEST_MODE
      error: {
        code: string
        message: string
      }
    }

export type OperationalAuditEventSummary = {
  workspaceId: string
  totalEvents: number
  byCategory: Record<OperationalAuditCategory, number>
  bySeverity: Record<OperationalAuditSeverity, number>
  byStatus: Record<OperationalAuditStatus, number>
  latestOccurredAt: string | null
  flags: {
    mode: typeof OPERATIONAL_AUDIT_TEST_MODE
    testInternalAdminOnly: true
    productionActivation: false
    durableProductionAudit: false
  }
  warnings: string[]
}

export async function listOperationalAuditEvents(input: {
  repository: OperationalAuditEventRepository
  workspaceId?: string | null
  limit?: number
}): Promise<OperationalAuditEventResult<{ events: readonly OperationalAuditEvent[]; warnings: string[] }>> {
  const workspaceId = normalizeRequiredString(input.workspaceId)

  if (!workspaceId) {
    return fail("WORKSPACE_ID_REQUIRED", "workspace_id is required.")
  }

  const events = await input.repository.listEvents({
    workspaceId,
    limit: normalizeLimit(input.limit),
  })

  return succeed({
    events,
    warnings: testAdminWarnings(),
  })
}

export async function createOperationalAuditEvent(input: {
  repository: OperationalAuditEventRepository
  event: OperationalAuditEventCreateInput
}): Promise<OperationalAuditEventResult<{ event: OperationalAuditEvent; warnings: string[] }>> {
  const buildResult = await import("./operational-audit-event-builder").then(
    ({ buildOperationalAuditEvent }) => buildOperationalAuditEvent(input.event)
  )

  if (!buildResult.ok) {
    return fail(buildResult.error.code, buildResult.error.message)
  }

  const event = await input.repository.createEvent(buildResult.event)

  return succeed({
    event,
    warnings: testAdminWarnings(),
  })
}

export async function getOperationalAuditEventSummary(input: {
  repository: OperationalAuditEventRepository
  workspaceId?: string | null
  limit?: number
}): Promise<OperationalAuditEventResult<OperationalAuditEventSummary>> {
  const listResult = await listOperationalAuditEvents(input)

  if (!listResult.ok) {
    return listResult
  }

  return succeed(buildOperationalAuditEventSummary({
    workspaceId: normalizeRequiredString(input.workspaceId) ?? "",
    events: listResult.data.events,
  }))
}

export function buildOperationalAuditEventSummary(input: {
  workspaceId: string
  events: readonly OperationalAuditEvent[]
}): OperationalAuditEventSummary {
  const byCategory = buildCategoryCounter()
  const bySeverity = buildSeverityCounter()
  const byStatus = buildStatusCounter()
  let latestOccurredAt: string | null = null

  for (const event of input.events) {
    byCategory[event.category] += 1
    bySeverity[event.severity] += 1
    byStatus[event.status] += 1

    if (!latestOccurredAt || event.occurredAt > latestOccurredAt) {
      latestOccurredAt = event.occurredAt
    }
  }

  return {
    workspaceId: input.workspaceId,
    totalEvents: input.events.length,
    byCategory,
    bySeverity,
    byStatus,
    latestOccurredAt,
    flags: {
      mode: OPERATIONAL_AUDIT_TEST_MODE,
      testInternalAdminOnly: true,
      productionActivation: false,
      durableProductionAudit: false,
    },
    warnings: testAdminWarnings(),
  }
}

export function isOperationalAuditCategory(
  value: string
): value is OperationalAuditCategory {
  return operationalAuditCategories.includes(value as OperationalAuditCategory)
}

export function isOperationalAuditSeverity(
  value: string
): value is OperationalAuditSeverity {
  return operationalAuditSeverities.includes(value as OperationalAuditSeverity)
}

export function isOperationalAuditStatus(
  value: string
): value is OperationalAuditStatus {
  return operationalAuditStatuses.includes(value as OperationalAuditStatus)
}

export function testAdminWarnings(): string[] {
  return [
    "TEST/internal/admin support only.",
    "Operational audit events do not activate production governance.",
    "This is not durable production mutation audit persistence.",
    "Song/submission/evidence workflows remain TEST-only.",
  ]
}

export function normalizeRequiredString(value?: string | null): string | null {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

function normalizeLimit(limit?: number): number {
  if (!Number.isFinite(limit) || !limit) {
    return 50
  }

  return Math.min(Math.max(Math.trunc(limit), 1), 100)
}

function buildCategoryCounter(): Record<OperationalAuditCategory, number> {
  return Object.fromEntries(
    operationalAuditCategories.map((category) => [category, 0])
  ) as Record<OperationalAuditCategory, number>
}

function buildSeverityCounter(): Record<OperationalAuditSeverity, number> {
  return Object.fromEntries(
    operationalAuditSeverities.map((severity) => [severity, 0])
  ) as Record<OperationalAuditSeverity, number>
}

function buildStatusCounter(): Record<OperationalAuditStatus, number> {
  return Object.fromEntries(
    operationalAuditStatuses.map((status) => [status, 0])
  ) as Record<OperationalAuditStatus, number>
}

function succeed<T>(data: T): OperationalAuditEventResult<T> {
  return {
    ok: true,
    mode: OPERATIONAL_AUDIT_TEST_MODE,
    data,
  }
}

function fail<T = never>(
  code: string,
  message: string
): OperationalAuditEventResult<T> {
  return {
    ok: false,
    mode: OPERATIONAL_AUDIT_TEST_MODE,
    error: {
      code,
      message,
    },
  }
}
