import { NextRequest, NextResponse } from "next/server"

import { getWorkspaceAdminOverview } from "@/lib/workspace-admin/workspace-admin-overview"
import { workspaceAdminOverviewSupabaseRepositories } from "@/lib/workspace-admin/workspace-admin-overview-supabase"

export async function GET(request: NextRequest) {
  const workspaceId = request.nextUrl.searchParams.get("workspace_id")
  const result = await getWorkspaceAdminOverview({
    repositories: workspaceAdminOverviewSupabaseRepositories,
    workspaceId,
  })

  return NextResponse.json(result, { status: result.ok ? 200 : 400 })
}
