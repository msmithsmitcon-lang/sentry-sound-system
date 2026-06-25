import { NextRequest, NextResponse } from "next/server"

import { getWorkspaceOnboardingSummary } from "@/lib/workspace-onboarding/workspace-onboarding-admin"
import { workspaceOnboardingAdminSupabaseRepository } from "@/lib/workspace-onboarding/workspace-onboarding-admin-supabase"

export async function GET(request: NextRequest) {
  const workspaceId = request.nextUrl.searchParams.get("workspace_id")
  const result = await getWorkspaceOnboardingSummary({
    repository: workspaceOnboardingAdminSupabaseRepository,
    workspaceId,
  })

  return NextResponse.json(result, { status: result.ok ? 200 : 400 })
}
