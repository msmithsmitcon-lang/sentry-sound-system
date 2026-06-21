export const WORKS_READ_MODEL_SOURCE =
  "canonical_works_read_model_v1" as const

export const WORKS_READ_MODEL_MODE = "summary" as const

export type WorksReadModelSource = typeof WORKS_READ_MODEL_SOURCE

export type WorksReadModelMode = typeof WORKS_READ_MODEL_MODE

export type WorkSummary = {
  id: string
  asset_id: string | null
  work_title: string | null
  genre: string | null
  mood: string | null
  themes: string | null
  copyright_status: string | null
  registration_status: string | null
  created_at: string | null
  contributor_count: number
  split_total: number
  work_intelligence_v1: unknown
}

export type WorksReadModelResponse = {
  success: true
  works: WorkSummary[]
  source: WorksReadModelSource
  mode: WorksReadModelMode
}

export type WorksReadModelErrorResponse = {
  success: false
  error: string
  source: WorksReadModelSource
  mode: WorksReadModelMode
}

