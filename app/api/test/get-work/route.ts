import { NextResponse } from "next/server"

import { prisma } from "@/lib/db/prisma"

type RecentWorkRow = {
  id: string
  asset_id: string | null
  work_title: string | null
  genre: string | null
  mood: string | null
  themes: string | null
  copyright_status: string | null
  registration_status: string | null
  created_at: Date | string | null
  contributor_count: number
  split_total: number
  work_intelligence_v1: unknown
}

export async function GET() {
  const works = await prisma.$queryRaw<RecentWorkRow[]>`
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
    LIMIT 10
  `

  return NextResponse.json(works)
}
