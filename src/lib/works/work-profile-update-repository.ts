import { prisma } from "@/lib/db/prisma"

import {
  buildWorkIntelligenceV1Payload,
  WORK_INTELLIGENCE_V1_METADATA_KEY,
  type WorkIntelligenceV1,
} from "./work-intelligence-v1"
import {
  toWorkIntelligenceV1Input,
  type UpdatedWorkProfile,
  type WorkProfileUpdateInput,
} from "./work-profile-update.types"

type UpdatedWorkProfileRow = {
  work_id: string
  themes: string | null
  work_intelligence_v1: WorkIntelligenceV1
}

export async function updateCanonicalWorkProfile(
  workId: string,
  workspaceId: string,
  input: WorkProfileUpdateInput
): Promise<UpdatedWorkProfile> {
  const payload = buildWorkIntelligenceV1Payload(
    toWorkIntelligenceV1Input(input)
  )
  const primaryArtistTag = buildPrimaryArtistTag(input)
  const releaseProjectGroupingTag = buildReleaseProjectGroupingTag(input)

  const rows = await prisma.$queryRaw<UpdatedWorkProfileRow[]>`
    UPDATE musical_works
    SET
      themes = NULLIF(${payload.themes}, ''),
      metadata = jsonb_set(
        COALESCE(metadata, '{}'::jsonb),
        ARRAY[${WORK_INTELLIGENCE_V1_METADATA_KEY}]::text[],
        COALESCE(metadata -> ${WORK_INTELLIGENCE_V1_METADATA_KEY}, '{}'::jsonb)
          || jsonb_build_object(
            'creative_truth',
            ${JSON.stringify(payload.creative_truth)}::jsonb,
            'system_insights',
            COALESCE(
              metadata -> ${WORK_INTELLIGENCE_V1_METADATA_KEY} -> 'system_insights',
              ${JSON.stringify(payload.default_system_insights)}::jsonb
            )
          )
          || ${JSON.stringify(primaryArtistTag)}::jsonb
          || ${JSON.stringify(releaseProjectGroupingTag)}::jsonb,
        true
      )
    WHERE id = ${workId}::uuid
      AND workspace_id = ${workspaceId}::uuid
    RETURNING
      id AS work_id,
      themes,
      metadata -> ${WORK_INTELLIGENCE_V1_METADATA_KEY} AS work_intelligence_v1
  `

  const row = rows[0]

  if (!row) {
    throw new Error("Work not found.")
  }

  return row
}

function buildPrimaryArtistTag(input: WorkProfileUpdateInput) {
  const artistProfileId = normalizeText(input.primary_artist_profile_id)
  const displayName = normalizeText(input.primary_artist_display_name)

  if (!artistProfileId || !displayName) {
    return {}
  }

  return {
    primary_artist_profile_id: artistProfileId,
    primary_artist_display_name: displayName,
    primary_artist_tagged_for_future_relationship:
      input.primary_artist_tagged_for_future_relationship === true,
  }
}

function buildReleaseProjectGroupingTag(input: WorkProfileUpdateInput) {
  const groupingType = normalizeText(input.release_project_grouping_type)
  const groupingLabel = normalizeText(input.release_project_grouping_label)

  if (!groupingType || !groupingLabel) {
    return {}
  }

  return {
    release_project_grouping_type: groupingType,
    release_project_grouping_label: groupingLabel,
    release_project_grouping_tagged_for_future_relationship:
      input.release_project_grouping_tagged_for_future_relationship === true,
  }
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}
