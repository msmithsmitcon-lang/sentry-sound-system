import {
  BuildOperationalAuditEventInput,
  isOperationalAuditCategory,
  isOperationalAuditSeverity,
  isOperationalAuditStatus,
  OPERATIONAL_AUDIT_TEST_MODE,
  OperationalAuditEvent,
  OperationalAuditEventBuildErrorCode,
  OperationalAuditEventBuildResult,
  normalizeRequiredString,
} from "./operational-audit-event"

export function buildOperationalAuditEvent(
  input: BuildOperationalAuditEventInput
): OperationalAuditEventBuildResult {
  const workspaceId = normalizeRequiredString(input.workspaceId)
  const action = normalizeRequiredString(input.action)
  const resourceType = normalizeRequiredString(input.resourceType)
  const category = input.category?.trim()
  const severity = input.severity?.trim()
  const status = input.status?.trim()
  const occurredAt = input.occurredAt ?? new Date().toISOString()

  if (!workspaceId) {
    return fail("WORKSPACE_ID_REQUIRED", "workspaceId is required.")
  }

  if (!action) {
    return fail("ACTION_REQUIRED", "action is required.")
  }

  if (!resourceType) {
    return fail("RESOURCE_TYPE_REQUIRED", "resourceType is required.")
  }

  if (!category || !isOperationalAuditCategory(category)) {
    return fail("INVALID_CATEGORY", "category is not allowed.")
  }

  if (!severity || !isOperationalAuditSeverity(severity)) {
    return fail("INVALID_SEVERITY", "severity is not allowed.")
  }

  if (!status || !isOperationalAuditStatus(status)) {
    return fail("INVALID_STATUS", "status is not allowed.")
  }

  if (Number.isNaN(new Date(occurredAt).getTime())) {
    return fail("INVALID_OCCURRED_AT", "occurredAt must be a valid date.")
  }

  return {
    ok: true,
    event: {
      eventId: input.eventId ?? `operational_audit_${crypto.randomUUID()}`,
      workspaceId,
      actorUserId: normalizeNullableString(input.actorUserId),
      actorDisplayName: normalizeNullableString(input.actorDisplayName),
      actorEmail: normalizeNullableString(input.actorEmail),
      action,
      resourceType,
      resourceId: normalizeNullableString(input.resourceId),
      resourceLabel: normalizeNullableString(input.resourceLabel),
      category,
      severity,
      status,
      ipAddress: normalizeNullableString(input.ipAddress),
      userAgent: normalizeNullableString(input.userAgent),
      metadata: {
        ...(input.metadata ?? {}),
        routeMode: OPERATIONAL_AUDIT_TEST_MODE,
        productionActivation: false,
      },
      occurredAt,
      mode: OPERATIONAL_AUDIT_TEST_MODE,
      productionActivation: false,
    },
  }
}

function normalizeNullableString(value?: string | null): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function fail(
  code: OperationalAuditEventBuildErrorCode,
  message: string
): OperationalAuditEventBuildResult {
  return {
    ok: false,
    error: {
      code,
      message,
    },
  }
}
