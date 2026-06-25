import { NextRequest, NextResponse } from "next/server"

import { getEvidenceReadinessSummary } from "@/lib/evidence/evidence-readiness-aggregator"
import { evidenceReadinessSupabaseRepository } from "@/lib/evidence/evidence-readiness-supabase"

export async function GET(request: NextRequest) {
  const limitParam = request.nextUrl.searchParams.get("limit")
  const result = await getEvidenceReadinessSummary({
    repository: evidenceReadinessSupabaseRepository,
    workspaceId: request.nextUrl.searchParams.get("workspace_id"),
    limit: limitParam ? Number(limitParam) : undefined,
  })

  return NextResponse.json(result, { status: result.ok ? 200 : 400 })
}
