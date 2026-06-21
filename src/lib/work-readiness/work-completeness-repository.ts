import { prisma } from "@/lib/db/prisma"

export type WorkCompletenessFacts = {
  id: string
  work_title: string | null
  genre: string | null
  mood: string | null
  themes: string | null
  created_at: Date | string | null
  contributor_count: number
  split_total: number
  unconfirmed_contributor_count: number
  supporting_material_count: number
  split_sheet_reference_count: number
  work_intelligence_v1: unknown
}

export async function getWorkCompletenessFacts(
  workId: string,
  workspaceId: string
): Promise<WorkCompletenessFacts | null> {
  const rows = await prisma.$queryRaw<WorkCompletenessFacts[]>`
    SELECT
      mw.id,
      mw.work_title,
      mw.genre,
      mw.mood,
      mw.themes,
      mw.created_at,
      COALESCE(contributor_summary.contributor_count, 0)::int AS contributor_count,
      COALESCE(contributor_summary.split_total, 0)::float8 AS split_total,
      COALESCE(contributor_summary.unconfirmed_contributor_count, 0)::int AS unconfirmed_contributor_count,
      COALESCE(material_summary.supporting_material_count, 0)::int AS supporting_material_count,
      COALESCE(material_summary.split_sheet_reference_count, 0)::int AS split_sheet_reference_count,
      mw.metadata -> 'work_intelligence_v1' AS work_intelligence_v1
    FROM musical_works mw
    LEFT JOIN LATERAL (
      SELECT
        COUNT(wc.id)::int AS contributor_count,
        COALESCE(SUM(wc.percentage), 0)::float8 AS split_total,
        COUNT(wc.id) FILTER (WHERE COALESCE(wc.confirmed, false) = false)::int AS unconfirmed_contributor_count
      FROM work_contributors wc
      INNER JOIN contributors c
        ON c.id = wc.contributor_id
       AND c.workspace_id = ${workspaceId}::uuid
      WHERE wc.work_id = mw.id
        AND wc.workspace_id = ${workspaceId}::uuid
    ) contributor_summary ON true
    LEFT JOIN LATERAL (
      SELECT
        COUNT(fvl.id)::int AS supporting_material_count,
        COUNT(fvl.id) FILTER (WHERE fvi.file_category = 'split_sheet')::int AS split_sheet_reference_count
      FROM file_vault_links fvl
      INNER JOIN file_vault_items fvi
        ON fvi.id = fvl.file_vault_item_id
       AND fvi.workspace_id = fvl.workspace_id
      WHERE fvl.workspace_id = ${workspaceId}::uuid
        AND fvl.linked_record_type = 'musical_work'
        AND fvl.linked_record_id = mw.id
    ) material_summary ON true
    WHERE mw.id = ${workId}::uuid
      AND mw.workspace_id = ${workspaceId}::uuid
    LIMIT 1
  `

  return rows[0] ?? null
}
