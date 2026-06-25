import { NextRequest, NextResponse } from "next/server"

import { getContributorSummary } from "@/lib/contributors/contributor-admin"
import { contributorAdminSupabaseRepository } from "@/lib/contributors/contributor-admin-supabase"

export async function GET(request: NextRequest) {
  const limitParam = request.nextUrl.searchParams.get("limit")
  const result = await getContributorSummary({
    repository: contributorAdminSupabaseRepository,
    workspaceId: request.nextUrl.searchParams.get("workspace_id"),
    limit: limitParam ? Number(limitParam) : undefined,
  })

  return NextResponse.json(result, { status: result.ok ? 200 : 400 })
}
