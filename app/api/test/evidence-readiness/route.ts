import { NextRequest, NextResponse } from "next/server"

import { getEvidenceReadiness } from "@/lib/evidence/evidence-readiness-aggregator"
import { evidenceReadinessSupabaseRepository } from "@/lib/evidence/evidence-readiness-supabase"

export async function GET(request: NextRequest) {
  const limitParam = request.nextUrl.searchParams.get("limit")
  const result = await getEvidenceReadiness({
    repository: evidenceReadinessSupabaseRepository,
    workspaceId: request.nextUrl.searchParams.get("workspace_id"),
    entityType: request.nextUrl.searchParams.get("entity_type"),
    entityId: request.nextUrl.searchParams.get("entity_id"),
    limit: limitParam ? Number(limitParam) : undefined,
  })

  return NextResponse.json(result, { status: result.ok ? 200 : 400 })
}
