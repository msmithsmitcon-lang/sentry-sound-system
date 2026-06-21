export const LIFECYCLE_TEST_MODE = "TEST_INTERNAL_ADMIN_ONLY"

export const lifecycleEntityTypes = [
  "workspace",
  "onboarding",
  "song",
  "contributor",
  "evidence",
  "submission",
  "file",
  "template",
  "system",
] as const

export const lifecycleStateFamilies = [
  "onboarding",
  "song_capture",
  "evidence",
  "submission",
  "file",
  "generic",
] as const

export const lifecycleStatesByFamily = {
  onboarding: ["not_started", "in_progress", "review", "completed", "blocked"],
  song_capture: [
    "draft",
    "metadata_started",
    "contributors_added",
    "splits_validated",
    "files_added",
    "evidence_pending",
    "ready_for_review",
    "ready_for_submission",
    "blocked",
  ],
  evidence: [
    "missing",
    "pending",
    "uploaded",
    "in_review",
    "verified",
    "rejected",
    "expired",
    "not_applicable",
  ],
  submission: [
    "draft",
    "readiness_check",
    "queued",
    "pending_review",
    "under_review",
    "approved",
    "rejected",
    "changes_requested",
    "blocked",
  ],
  file: ["uploaded", "linked", "shared", "archived", "expired"],
  generic: ["created", "updated", "blocked", "completed"],
} as const

export type LifecycleEntityType = (typeof lifecycleEntityTypes)[number]
export type LifecycleStateFamily = (typeof lifecycleStateFamilies)[number]
export type LifecycleState =
  (typeof lifecycleStatesByFamily)[LifecycleStateFamily][number]

export function isLifecycleEntityType(value: string): value is LifecycleEntityType {
  return lifecycleEntityTypes.includes(value as LifecycleEntityType)
}

export function resolveLifecycleStateFamily(
  entityType: LifecycleEntityType
): LifecycleStateFamily {
  switch (entityType) {
    case "onboarding":
      return "onboarding"
    case "song":
      return "song_capture"
    case "evidence":
      return "evidence"
    case "submission":
      return "submission"
    case "file":
      return "file"
    default:
      return "generic"
  }
}

export function isLifecycleStateForFamily(
  family: LifecycleStateFamily,
  state: string
): state is LifecycleState {
  return (lifecycleStatesByFamily[family] as readonly string[]).includes(state)
}
