import { buildOperationalAuditEvent } from "@/lib/audit/operational-audit-event-builder"
import { OperationalAuditEvent } from "@/lib/audit/operational-audit-event"

import { LIFECYCLE_TEST_MODE, LifecycleEntityType, LifecycleState, LifecycleStateFamily } from "./lifecycle-state"
import { validateLifecycleTransition } from "./lifecycle-transition"

export type LifecycleEvent = {
  eventId: string
  workspaceId: string
  entityType: LifecycleEntityType
  entityId: string
  family: LifecycleStateFamily
  currentState: LifecycleState
  nextState: LifecycleState
  transitionKey: string
  actorUserId: string | null
  reason: string | null
  metadata: Record<string, unknown>
  auditEvent: OperationalAuditEvent
  occurredAt: string
  mode: typeof LIFECYCLE_TEST_MODE
  productionActivation: false
}

export type BuildLifecycleEventInput = {
  eventId?: string
  workspaceId?: string | null
  entityType?: string | null
  entityId?: string | null
  currentState?: string | null
  nextState?: string | null
  transitionKey?: string | null
  actorUserId?: string | null
  reason?: string | null
  metadata?: Record<string, unknown>
  occurredAt?: string
}

export type LifecycleEventBuildResult =
  | {
      ok: true
      event: LifecycleEvent
    }
  | {
      ok: false
      error: {
        code:
          | "WORKSPACE_ID_REQUIRED"
          | "ENTITY_ID_REQUIRED"
          | "TRANSITION_KEY_REQUIRED"
          | "INVALID_OCCURRED_AT"
          | "INVALID_ENTITY_TYPE"
          | "INVALID_CURRENT_STATE"
          | "INVALID_NEXT_STATE"
          | "INVALID_TRANSITION"
          | "AUDIT_EVENT_BUILD_FAILED"
        message: string
      }
    }

type LifecycleEventBuildErrorCode =
  | "WORKSPACE_ID_REQUIRED"
  | "ENTITY_ID_REQUIRED"
  | "TRANSITION_KEY_REQUIRED"
  | "INVALID_OCCURRED_AT"
  | "INVALID_ENTITY_TYPE"
  | "INVALID_CURRENT_STATE"
  | "INVALID_NEXT_STATE"
  | "INVALID_TRANSITION"
  | "AUDIT_EVENT_BUILD_FAILED"

export function buildLifecycleEvent(
  input: BuildLifecycleEventInput
): LifecycleEventBuildResult {
  const workspaceId = normalizeRequiredString(input.workspaceId)
  const entityId = normalizeRequiredString(input.entityId)
  const transitionKey = normalizeRequiredString(input.transitionKey)
  const occurredAt = input.occurredAt ?? new Date().toISOString()

  if (!workspaceId) {
    return fail("WORKSPACE_ID_REQUIRED", "workspace_id is required.")
  }

  if (!entityId) {
    return fail("ENTITY_ID_REQUIRED", "entity_id is required.")
  }

  if (!transitionKey) {
    return fail("TRANSITION_KEY_REQUIRED", "transition_key is required.")
  }

  if (Number.isNaN(new Date(occurredAt).getTime())) {
    return fail("INVALID_OCCURRED_AT", "occurred_at must be a valid date.")
  }

  const transition = validateLifecycleTransition({
    entityType: input.entityType,
    currentState: input.currentState,
    nextState: input.nextState,
  })

  if (!transition.ok) {
    return fail(transition.error.code, transition.error.message)
  }

  const auditBuild = buildOperationalAuditEvent({
    workspaceId,
    actorUserId: input.actorUserId,
    action: `lifecycle.${transitionKey}`,
    resourceType: transition.entityType,
    resourceId: entityId,
    resourceLabel: `${transition.currentState} -> ${transition.nextState}`,
    category: mapEntityTypeToAuditCategory(transition.entityType),
    severity: transition.nextState === "blocked" ? "warning" : "info",
    status: transition.nextState === "blocked" ? "blocked" : "success",
    metadata: {
      ...(input.metadata ?? {}),
      lifecycleTransition: {
        family: transition.family,
        currentState: transition.currentState,
        nextState: transition.nextState,
        transitionKey,
      },
      routeMode: LIFECYCLE_TEST_MODE,
      productionActivation: false,
    },
    occurredAt,
  })

  if (!auditBuild.ok) {
    return fail("AUDIT_EVENT_BUILD_FAILED", auditBuild.error.message)
  }

  return {
    ok: true,
    event: {
      eventId: input.eventId ?? `lifecycle_${crypto.randomUUID()}`,
      workspaceId,
      entityType: transition.entityType,
      entityId,
      family: transition.family,
      currentState: transition.currentState,
      nextState: transition.nextState,
      transitionKey,
      actorUserId: normalizeNullableString(input.actorUserId),
      reason: normalizeNullableString(input.reason),
      metadata: {
        ...(input.metadata ?? {}),
        routeMode: LIFECYCLE_TEST_MODE,
        productionActivation: false,
      },
      auditEvent: auditBuild.event,
      occurredAt,
      mode: LIFECYCLE_TEST_MODE,
      productionActivation: false,
    },
  }
}

function mapEntityTypeToAuditCategory(
  entityType: LifecycleEntityType
): OperationalAuditEvent["category"] {
  switch (entityType) {
    case "song":
      return "song"
    case "contributor":
      return "contributor"
    case "evidence":
      return "evidence"
    case "file":
      return "file"
    case "submission":
      return "submission"
    case "workspace":
    case "onboarding":
      return "workspace"
    default:
      return "system"
  }
}

function normalizeRequiredString(value?: string | null): string | null {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

function normalizeNullableString(value?: string | null): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function fail(
  code: LifecycleEventBuildErrorCode,
  message: string
): LifecycleEventBuildResult {
  return {
    ok: false,
    error: {
      code,
      message,
    },
  }
}
