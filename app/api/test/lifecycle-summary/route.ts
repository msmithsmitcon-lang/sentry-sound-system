import { NextRequest, NextResponse } from "next/server"

import { getLifecycleSummary } from "@/lib/workflow/lifecycle-admin"
import { lifecycleAdminSupabaseRepository } from "@/lib/workflow/lifecycle-admin-supabase"

export async function GET(request: NextRequest) {
  const limitParam = request.nextUrl.searchParams.get("limit")
  const result = await getLifecycleSummary({
    repository: lifecycleAdminSupabaseRepository,
    workspaceId: request.nextUrl.searchParams.get("workspace_id"),
    entityType: request.nextUrl.searchParams.get("entity_type"),
    entityId: request.nextUrl.searchParams.get("entity_id"),
    limit: limitParam ? Number(limitParam) : undefined,
  })

  return NextResponse.json(result, { status: result.ok ? 200 : 400 })
}
