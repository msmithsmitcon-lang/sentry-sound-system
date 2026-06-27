import { prisma } from "@/lib/db/prisma"

export type UpdateWorkBasicsInput = {
  isrc?: string | null
  bpm?: number | null
  musical_key?: string | null
}

export type UpdatedWorkBasics = {
  work_id: string
  isrc: string | null
  bpm: number | null
  musical_key: string | null
}

type UpdatedWorkBasicsRow = {
  id: string
  isrc: string | null
  bpm: number | null
  musical_key: string | null
}

export async function updateWorkBasics(
  workId: string,
  workspaceId: string,
  input: UpdateWorkBasicsInput
): Promise<UpdatedWorkBasics> {
  const isrc = normalizeIsrc(input.isrc)
  const musicalKey = normalizeText(input.musical_key)
  const bpm = normalizeBpm(input.bpm)

  const rows = await prisma.$queryRaw<UpdatedWorkBasicsRow[]>`
    UPDATE musical_works
    SET isrc = ${isrc}, bpm = ${bpm}, musical_key = ${musicalKey}
    WHERE id = ${workId}::uuid
      AND workspace_id = ${workspaceId}::uuid
    RETURNING id, isrc, bpm, musical_key
  `

  const row = rows[0]

  if (!row) {
    throw new Error("Work not found.")
  }

  return {
    work_id: row.id,
    isrc: row.isrc,
    bpm: row.bpm,
    musical_key: row.musical_key,
  }
}

function normalizeText(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function normalizeIsrc(value: unknown): string | null {
  const normalized = normalizeText(value)
  return normalized ? normalized.toUpperCase() : null
}

function normalizeBpm(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null
  return Math.round(value)
}
