import type {
  WorkIntelligenceCleanExplicit,
  WorkIntelligenceEnergy,
  WorkIntelligenceV1,
  WorkIntelligenceV1Input,
} from "./work-intelligence-v1"

export const WORK_PROFILE_UPDATE_SOURCE =
  "canonical_work_profile_update_v1" as const

export const WORK_PROFILE_UPDATE_MODE = "profile_update" as const

export type WorkProfileUpdateSource = typeof WORK_PROFILE_UPDATE_SOURCE

export type WorkProfileUpdateMode = typeof WORK_PROFILE_UPDATE_MODE

export type WorkProfileUpdateInput = {
  themes?: string
  alternative_title?: string
  language?: string
  energy?: WorkIntelligenceEnergy
  clean_explicit?: WorkIntelligenceCleanExplicit
  creative_description?: string
  inspiration_reference_notes?: string
  primary_artist_profile_id?: string
  primary_artist_display_name?: string
  primary_artist_tagged_for_future_relationship?: boolean
  release_project_grouping_type?: string
  release_project_grouping_label?: string
  release_project_grouping_tagged_for_future_relationship?: boolean
}

export type UpdatedWorkProfile = {
  work_id: string
  themes: string | null
  work_intelligence_v1: WorkIntelligenceV1
}

export type WorkProfileUpdateResponse = {
  success: true
  work_id: string
  themes: string | null
  work_intelligence_v1: WorkIntelligenceV1
  source: WorkProfileUpdateSource
  mode: WorkProfileUpdateMode
}

export type WorkProfileUpdateErrorResponse = {
  success: false
  error: string
  source: WorkProfileUpdateSource
  mode: WorkProfileUpdateMode
}

export function toWorkIntelligenceV1Input(
  input: WorkProfileUpdateInput
): WorkIntelligenceV1Input {
  return {
    themes: input.themes,
    alternative_title: input.alternative_title,
    language: input.language,
    energy: input.energy,
    clean_explicit: input.clean_explicit,
    creative_description: input.creative_description,
    inspiration_reference_notes: input.inspiration_reference_notes,
  }
}
