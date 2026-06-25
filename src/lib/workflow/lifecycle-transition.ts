import {
  isLifecycleEntityType,
  isLifecycleStateForFamily,
  LifecycleEntityType,
  LifecycleState,
  LifecycleStateFamily,
  resolveLifecycleStateFamily,
} from "./lifecycle-state"

export type LifecycleTransitionValidationInput = {
  entityType?: string | null
  currentState?: string | null
  nextState?: string | null
}

export type LifecycleTransitionValidationResult =
  | {
      ok: true
      entityType: LifecycleEntityType
      family: LifecycleStateFamily
      currentState: LifecycleState
      nextState: LifecycleState
    }
  | {
      ok: false
      error: {
        code:
          | "INVALID_ENTITY_TYPE"
          | "INVALID_CURRENT_STATE"
          | "INVALID_NEXT_STATE"
          | "INVALID_TRANSITION"
        message: string
      }
    }

type LifecycleTransitionValidationErrorCode =
  | "INVALID_ENTITY_TYPE"
  | "INVALID_CURRENT_STATE"
  | "INVALID_NEXT_STATE"
  | "INVALID_TRANSITION"

const allowedTransitions: Record<LifecycleStateFamily, Record<string, string[]>> = {
  onboarding: {
    not_started: ["in_progress", "blocked"],
    in_progress: ["review", "blocked"],
    review: ["completed", "in_progress", "blocked"],
    blocked: ["in_progress"],
    completed: [],
  },
  song_capture: {
    draft: ["metadata_started", "blocked"],
    metadata_started: ["contributors_added", "blocked"],
    contributors_added: ["splits_validated", "blocked"],
    splits_validated: ["files_added", "blocked"],
    files_added: ["evidence_pending", "ready_for_review", "blocked"],
    evidence_pending: ["ready_for_review", "blocked"],
    ready_for_review: ["ready_for_submission", "blocked"],
    ready_for_submission: ["blocked"],
    blocked: ["draft", "metadata_started", "ready_for_review"],
  },
  evidence: {
    missing: ["pending", "not_applicable"],
    pending: ["uploaded", "rejected"],
    uploaded: ["in_review"],
    in_review: ["verified", "rejected", "expired"],
    verified: ["expired"],
    rejected: ["pending"],
    expired: ["pending"],
    not_applicable: [],
  },
  submission: {
    draft: ["readiness_check", "blocked"],
    readiness_check: ["queued", "blocked"],
    queued: ["pending_review", "blocked"],
    pending_review: ["under_review", "changes_requested", "blocked"],
    under_review: ["approved", "rejected", "changes_requested", "blocked"],
    approved: [],
    rejected: ["changes_requested"],
    changes_requested: ["readiness_check", "queued"],
    blocked: ["readiness_check"],
  },
  file: {
    uploaded: ["linked", "shared", "archived", "expired"],
    linked: ["shared", "archived", "expired"],
    shared: ["archived", "expired"],
    archived: [],
    expired: [],
  },
  generic: {
    created: ["updated", "blocked", "completed"],
    updated: ["updated", "blocked", "completed"],
    blocked: ["updated", "completed"],
    completed: [],
  },
}

export function validateLifecycleTransition(
  input: LifecycleTransitionValidationInput
): LifecycleTransitionValidationResult {
  const entityType = input.entityType?.trim()
  const currentState = input.currentState?.trim()
  const nextState = input.nextState?.trim()

  if (!entityType || !isLifecycleEntityType(entityType)) {
    return fail("INVALID_ENTITY_TYPE", "entity_type is not allowed.")
  }

  const family = resolveLifecycleStateFamily(entityType)

  if (!currentState || !isLifecycleStateForFamily(family, currentState)) {
    return fail(
      "INVALID_CURRENT_STATE",
      "current_state is not allowed for this entity type."
    )
  }

  if (!nextState || !isLifecycleStateForFamily(family, nextState)) {
    return fail(
      "INVALID_NEXT_STATE",
      "next_state is not allowed for this entity type."
    )
  }

  if (!allowedTransitions[family][currentState]?.includes(nextState)) {
    return fail("INVALID_TRANSITION", "Lifecycle transition is not allowed.")
  }

  return {
    ok: true,
    entityType,
    family,
    currentState,
    nextState,
  }
}

function fail(
  code: LifecycleTransitionValidationErrorCode,
  message: string
): LifecycleTransitionValidationResult {
  return {
    ok: false,
    error: {
      code,
      message,
    },
  }
}
