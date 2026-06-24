import { prisma } from "@/lib/db/prisma"

export type CmoWorkRecord = {
  id: string
  work_title: string
  genre: string | null
  iswc: string | null
  language: string | null
  duration_seconds: number | null
  publisher_name: string | null
  publisher_share: number | null
}

export type CmoContributorRecord = {
  contributor_id: string
  name: string
  role: string
  split_type: string
  percentage: number
  confirmed: boolean
  cae_ipi: string | null
}

/**
 * Reads work + contributor data from the live workspace-scoped tables
 * (musical_works / work_contributors / contributors) — the tables the
 * production song registration wizard (song-capture-v2) actually writes
 * to via rpc_create_song_with_contributors.
 *
 * NOTE: a separate, more elaborate SAMRO export/validation subsystem
 * already exists at src/lib/registration/submission-engine/* (CSV
 * building, ownership/identity/role/territory validation, fingerprinted
 * snapshots). That subsystem operates against the Prisma-modeled
 * `MusicalWork`/`MusicalWorkContributor` models — a different,
 * currently-disconnected data model from the one the live wizard writes
 * to (confirmed: its own repository module is missing exports that
 * scripts/tests/*.ts expect, and it has no rows populated by the live
 * journey). Building this generator against the live tables, rather
 * than bridging two divergent data models, was the deliberate call here.
 */
export async function getCmoWorkRecord(
  workId: string,
  workspaceId: string
): Promise<CmoWorkRecord | null> {
  const rows = await prisma.$queryRaw<CmoWorkRecord[]>`
    SELECT
      id,
      work_title,
      genre::text AS genre,
      iswc,
      language,
      duration_seconds,
      publisher_name,
      publisher_share::float8 AS publisher_share
    FROM public.musical_works
    WHERE id = ${workId}::uuid
      AND workspace_id = ${workspaceId}::uuid
    LIMIT 1
  `

  return rows[0] ?? null
}

export async function getCmoContributorRecords(
  workId: string,
  workspaceId: string
): Promise<CmoContributorRecord[]> {
  return prisma.$queryRaw<CmoContributorRecord[]>`
    SELECT
      wc.contributor_id,
      COALESCE(c.stage_name, c.full_name) AS name,
      wc.role,
      wc.split_type,
      wc.percentage::float8 AS percentage,
      COALESCE(wc.confirmed, false) AS confirmed,
      c.metadata #>> '{song_capture_v2,ipi_id}' AS cae_ipi
    FROM public.work_contributors wc
    INNER JOIN public.contributors c ON c.id = wc.contributor_id
    WHERE wc.work_id = ${workId}::uuid
      AND wc.workspace_id = ${workspaceId}::uuid
      AND c.workspace_id = ${workspaceId}::uuid
    ORDER BY wc.created_at ASC
  `
}
