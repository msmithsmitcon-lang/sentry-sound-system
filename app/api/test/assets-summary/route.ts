import { NextRequest, NextResponse } from "next/server"

import { getAssetSummary } from "@/lib/assets/asset-admin"
import { assetAdminSupabaseRepository } from "@/lib/assets/asset-admin-supabase"

export async function GET(request: NextRequest) {
  const limitParam = request.nextUrl.searchParams.get("limit")
  const result = await getAssetSummary({
    repository: assetAdminSupabaseRepository,
    workspaceId: request.nextUrl.searchParams.get("workspace_id"),
    limit: limitParam ? Number(limitParam) : undefined,
  })

  return NextResponse.json(result, { status: result.ok ? 200 : 400 })
}
