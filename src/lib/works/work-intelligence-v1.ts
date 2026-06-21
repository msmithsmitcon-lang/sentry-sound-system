export const WORK_INTELLIGENCE_V1_METADATA_KEY = "work_intelligence_v1" as const

export type WorkIntelligenceSource = "manual"
export type WorkInsightSource = "system" | "ai"
export type WorkInsightStatus = "not_generated" | "available" | "needs_more_data"

export type WorkIntelligenceEnergy =
  | ""
  | "Low"
  | "Medium"
  | "High"
  | "Peak"

export type WorkIntelligenceCleanExplicit =
  | ""
  | "Clean"
  | "Explicit"
  | "Instrumental"
  | "Unknown"

export type WorkIntelligenceV1 = {
  creative_truth: WorkCreativeTruthV1
  system_insights: WorkSystemInsightsV1
  primary_artist_profile_id?: string
  primary_artist_display_name?: string
  primary_artist_tagged_for_future_relationship?: boolean
  release_project_grouping_type?: string
  release_project_grouping_label?: string
  release_project_grouping_tagged_for_future_relationship?: boolean
}

export type WorkCreativeTruthV1 = {
  alternative_title: string
  language: string
  energy: WorkIntelligenceEnergy
  clean_explicit: WorkIntelligenceCleanExplicit
  creative_description: string
  inspiration_reference_notes: string
  updated_at: string
  source: WorkIntelligenceSource
}

export type WorkSystemInsightsV1 = {
  audience_profile: string
  market_positioning: string
  sync_licensing_potential: string
  release_strategy: string
  campaign_suggestions: string
  opportunity_score: string
  generated_at: string
  source: WorkInsightSource
  status: WorkInsightStatus
}

export type WorkIntelligenceV1Input = Partial<
  Omit<WorkCreativeTruthV1, "updated_at" | "source">
> & {
  themes?: string
}

export type WorkIntelligenceV1SavePayload = {
  themes: string
  creative_truth: WorkCreativeTruthV1
  default_system_insights: WorkSystemInsightsV1
}

const ENERGY_VALUES = new Set<WorkIntelligenceEnergy>([
  "",
  "Low",
  "Medium",
  "High",
  "Peak",
])

const CLEAN_EXPLICIT_VALUES = new Set<WorkIntelligenceCleanExplicit>([
  "",
  "Clean",
  "Explicit",
  "Instrumental",
  "Unknown",
])

export function buildWorkIntelligenceV1Payload(
  input: WorkIntelligenceV1Input,
  now = new Date()
): WorkIntelligenceV1SavePayload {
  const energy = normalizeEnergy(input.energy)
  const cleanExplicit = normalizeCleanExplicit(input.clean_explicit)

  return {
    themes: normalizeText(input.themes),
    creative_truth: {
      alternative_title: normalizeText(input.alternative_title),
      language: normalizeText(input.language),
      energy,
      clean_explicit: cleanExplicit,
      creative_description: normalizeText(input.creative_description),
      inspiration_reference_notes: normalizeText(input.inspiration_reference_notes),
      updated_at: now.toISOString(),
      source: "manual",
    },
    default_system_insights: buildDefaultSystemInsights(),
  }
}

export function buildDefaultSystemInsights(): WorkSystemInsightsV1 {
  return {
    audience_profile: "",
    market_positioning: "",
    sync_licensing_potential: "",
    release_strategy: "",
    campaign_suggestions: "",
    opportunity_score: "",
    generated_at: "",
    source: "system",
    status: "not_generated",
  }
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function normalizeEnergy(value: unknown): WorkIntelligenceEnergy {
  const normalized = normalizeText(value)
  return ENERGY_VALUES.has(normalized as WorkIntelligenceEnergy)
    ? (normalized as WorkIntelligenceEnergy)
    : ""
}

function normalizeCleanExplicit(value: unknown): WorkIntelligenceCleanExplicit {
  const normalized = normalizeText(value)
  return CLEAN_EXPLICIT_VALUES.has(normalized as WorkIntelligenceCleanExplicit)
    ? (normalized as WorkIntelligenceCleanExplicit)
    : ""
}
