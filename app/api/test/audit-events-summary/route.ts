import { NextRequest, NextResponse } from "next/server"

import { getOperationalAuditEventSummary } from "@/lib/audit/operational-audit-event"
import { operationalAuditEventSupabaseRepository } from "@/lib/audit/operational-audit-event-supabase"

export async function GET(request: NextRequest) {
  const workspaceId = request.nextUrl.searchParams.get("workspace_id")
  const limitParam = request.nextUrl.searchParams.get("limit")
  const limit = limitParam ? Number(limitParam) : undefined
  const result = await getOperationalAuditEventSummary({
    repository: operationalAuditEventSupabaseRepository,
    workspaceId,
    limit,
  })

  return NextResponse.json(result, { status: result.ok ? 200 : 400 })
}
