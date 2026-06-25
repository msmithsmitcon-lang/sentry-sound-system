export const WORK_COMPLETENESS_SOURCE = "canonical_work_completeness_v1"

export const WORK_COMPLETENESS_MODE = "operational_visibility"

export const WORK_COMPLETENESS_DISCLAIMER =
  "This is operational completeness visibility only. It does not confirm legal clearance, evidence verification, royalty readiness, regulator acceptance, or submission approval."

export type WorkCompletenessStatus =
  | "needs_review"
  | "incomplete"
  | "review_ready"

export type WorkCompletenessCategoryStatus =
  | "captured"
  | "missing"
  | "needs_review"

export type WorkCompletenessCategoryKey =
  | "work_basics"
  | "contributors_splits"
  | "song_profile"
  | "supporting_materials"

export type WorkCompletenessItem = {
  key: string
  label: string
  status: WorkCompletenessCategoryStatus
  detail: string
}

export type WorkCompletenessCategory = {
  key: WorkCompletenessCategoryKey
  label: string
  status: WorkCompletenessCategoryStatus
  items: WorkCompletenessItem[]
}

export type WorkCompletenessReadModel = {
  work_id: string
  status: WorkCompletenessStatus
  categories: WorkCompletenessCategory[]
  missing_items: string[]
  review_notes: string[]
}

export type WorkCompletenessResponse = {
  success: true
  work_id: string
  status: WorkCompletenessStatus
  categories: WorkCompletenessCategory[]
  missing_items: string[]
  review_notes: string[]
  disclaimer: typeof WORK_COMPLETENESS_DISCLAIMER
  source: typeof WORK_COMPLETENESS_SOURCE
  mode: typeof WORK_COMPLETENESS_MODE
}

export type WorkCompletenessErrorResponse = {
  success: false
  error: string
  source: typeof WORK_COMPLETENESS_SOURCE
  mode: typeof WORK_COMPLETENESS_MODE
}
