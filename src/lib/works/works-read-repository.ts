import { prisma } from "@/lib/db/prisma"

import type { WorkSummary } from "./works-read-model.types"

type WorkSummaryRow = Omit<WorkSummary, "created_at"> & {
  created_at: Date | string | null
}

export async function getCanonicalWorkSummaryRows(input: {
  limit?: number
  workspaceId: string
}): Promise<WorkSummaryRow[]> {
  const limit = Math.min(Math.max(input.limit ?? 10, 1), 100)

  return prisma.$queryRaw<WorkSummaryRow[]>`
    SELECT
      mw.id,
      mw.asset_id,
      mw.work_title,
      mw.genre,
      mw.mood,
      mw.themes,
      mw.copyright_status,
      mw.registration_status,
      mw.created_at,
      COALESCE(COUNT(wc.id), 0)::int AS contributor_count,
      COALESCE(SUM(wc.percentage), 0)::float8 AS split_total,
      mw.metadata -> 'work_intelligence_v1' AS work_intelligence_v1
    FROM musical_works mw
    LEFT JOIN work_contributors wc ON wc.work_id = mw.id
    WHERE mw.workspace_id = ${input.workspaceId}::uuid
    GROUP BY
      mw.id,
      mw.asset_id,
      mw.work_title,
      mw.genre,
      mw.mood,
      mw.themes,
      mw.copyright_status,
      mw.registration_status,
      mw.created_at,
      mw.metadata
    ORDER BY mw.created_at DESC
    LIMIT ${limit}
  `
}
