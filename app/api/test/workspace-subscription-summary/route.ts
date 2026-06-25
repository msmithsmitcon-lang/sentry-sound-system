import { NextRequest, NextResponse } from "next/server"

import {
  getWorkspaceSubscriptionSummary,
} from "@/lib/entitlements"
import { workspaceSubscriptionAdminSupabaseRepository } from "@/lib/entitlements/workspace-subscription-admin-supabase"

export async function GET(request: NextRequest) {
  const workspaceId = request.nextUrl.searchParams.get("workspace_id")
  const result = await getWorkspaceSubscriptionSummary({
    repository: workspaceSubscriptionAdminSupabaseRepository,
    workspaceId,
  })

  return NextResponse.json(result, { status: result.ok ? 200 : 400 })
}
