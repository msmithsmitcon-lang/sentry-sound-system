import { prisma } from "@/lib/db/prisma"

import type {
  WorkDetail,
  WorkDetailContributor,
} from "./work-detail-read-model.types"

export type WorkDetailRow = Omit<WorkDetail, "created_at"> & {
  created_at: Date | string | null
}

export async function getCanonicalWorkDetailRow(
  workId: string,
  workspaceId: string
): Promise<WorkDetailRow | null> {
  const rows = await prisma.$queryRaw<WorkDetailRow[]>`
    SELECT
      mw.id,
      mw.asset_id,
      mw.work_title,
      mw.genre,
      mw.mood,
      mw.themes,
      mw.copyright_status,
      mw.registration_status,
      mw.isrc,
      mw.bpm,
      mw.musical_key,
      mw.created_at,
      COALESCE(COUNT(wc.id), 0)::int AS contributor_count,
      COALESCE(SUM(wc.percentage), 0)::float8 AS split_total,
      mw.metadata -> 'work_intelligence_v1' AS work_intelligence_v1
    FROM musical_works mw
    LEFT JOIN work_contributors wc ON wc.work_id = mw.id
    WHERE mw.id = ${workId}::uuid
      AND mw.workspace_id = ${workspaceId}::uuid
    GROUP BY
      mw.id,
      mw.asset_id,
      mw.work_title,
      mw.genre,
      mw.mood,
      mw.themes,
      mw.copyright_status,
      mw.registration_status,
      mw.isrc,
      mw.bpm,
      mw.musical_key,
      mw.created_at,
      mw.metadata
    LIMIT 1
  `

  return rows[0] ?? null
}

export async function getCanonicalWorkContributorRows(
  workId: string,
  workspaceId: string
): Promise<WorkDetailContributor[]> {
  return prisma.$queryRaw<WorkDetailContributor[]>`
    SELECT
      wc.id,
      wc.contributor_id,
      c.full_name AS contributor_name,
      c.stage_name,
      wc.role,
      wc.split_type,
      COALESCE(wc.percentage, 0)::float8 AS percentage,
      COALESCE(wc.confirmed, false) AS confirmed
    FROM work_contributors wc
    INNER JOIN contributors c ON c.id = wc.contributor_id
    WHERE wc.work_id = ${workId}::uuid
      AND wc.workspace_id = ${workspaceId}::uuid
      AND c.workspace_id = ${workspaceId}::uuid
    ORDER BY c.full_name ASC, wc.id ASC
  `
}
