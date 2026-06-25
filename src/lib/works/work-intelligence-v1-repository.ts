import { prisma } from "@/lib/db/prisma"

import {
  buildWorkIntelligenceV1Payload,
  WORK_INTELLIGENCE_V1_METADATA_KEY,
  type WorkIntelligenceV1,
  type WorkIntelligenceV1Input,
} from "./work-intelligence-v1"

export type SavedWorkIntelligenceV1 = {
  id: string
  themes: string | null
  work_intelligence_v1: WorkIntelligenceV1
}

type SavedWorkIntelligenceRow = {
  id: string
  themes: string | null
  work_intelligence_v1: WorkIntelligenceV1
}

export async function saveTestWorkIntelligenceV1(
  workId: string,
  input: WorkIntelligenceV1Input
): Promise<SavedWorkIntelligenceV1> {
  const payload = buildWorkIntelligenceV1Payload(input)

  const rows = await prisma.$queryRaw<SavedWorkIntelligenceRow[]>`
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
          ),
        true
      )
    WHERE id = ${workId}::uuid
    RETURNING
      id,
      themes,
      metadata -> ${WORK_INTELLIGENCE_V1_METADATA_KEY} AS work_intelligence_v1
  `

  const row = rows[0]

  if (!row) {
    throw new Error("Work not found in current TEST works table.")
  }

  return {
    id: row.id,
    themes: row.themes,
    work_intelligence_v1: row.work_intelligence_v1,
  }
}
