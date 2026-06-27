export const WORK_DETAIL_READ_MODEL_SOURCE =
  "canonical_work_detail_read_model_v1" as const

export const WORK_DETAIL_READ_MODEL_MODE = "detail" as const

export type WorkDetailReadModelSource =
  typeof WORK_DETAIL_READ_MODEL_SOURCE

export type WorkDetailReadModelMode = typeof WORK_DETAIL_READ_MODEL_MODE

export type WorkDetail = {
  id: string
  asset_id: string | null
  work_title: string | null
  genre: string | null
  mood: string | null
  themes: string | null
  copyright_status: string | null
  registration_status: string | null
  isrc: string | null
  bpm: number | null
  musical_key: string | null
  created_at: string | null
  contributor_count: number
  split_total: number
  contributors: WorkDetailContributor[]
  work_intelligence_v1: unknown
}

export type WorkDetailContributor = {
  id: string
  contributor_id: string
  contributor_name: string | null
  stage_name: string | null
  role: string | null
  split_type: string | null
  percentage: number
  confirmed: boolean
}

export type WorkDetailReadModelResponse = {
  success: true
  work: WorkDetail
  source: WorkDetailReadModelSource
  mode: WorkDetailReadModelMode
}

export type WorkDetailReadModelErrorResponse = {
  success: false
  error: string
  source: WorkDetailReadModelSource
  mode: WorkDetailReadModelMode
}
