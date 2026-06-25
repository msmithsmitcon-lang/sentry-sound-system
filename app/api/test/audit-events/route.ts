import { NextRequest, NextResponse } from "next/server"

import {
  createOperationalAuditEvent,
  listOperationalAuditEvents,
} from "@/lib/audit/operational-audit-event"
import { operationalAuditEventSupabaseRepository } from "@/lib/audit/operational-audit-event-supabase"

export async function GET(request: NextRequest) {
  const workspaceId = request.nextUrl.searchParams.get("workspace_id")
  const limitParam = request.nextUrl.searchParams.get("limit")
  const limit = limitParam ? Number(limitParam) : undefined
  const result = await listOperationalAuditEvents({
    repository: operationalAuditEventSupabaseRepository,
    workspaceId,
    limit,
  })

  return NextResponse.json(result, { status: result.ok ? 200 : 400 })
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      {
        ok: false,
        mode: "TEST_INTERNAL_ADMIN_ONLY",
        error: {
          code: "INVALID_JSON",
          message: "Request body must be JSON.",
        },
      },
      { status: 400 }
    )
  }

  const payload = body as Record<string, unknown>
  const result = await createOperationalAuditEvent({
    repository: operationalAuditEventSupabaseRepository,
    event: {
      workspaceId: readString(payload.workspace_id),
      actorUserId: readString(payload.actor_user_id),
      actorDisplayName: readString(payload.actor_display_name),
      actorEmail: readString(payload.actor_email),
      action: readString(payload.action),
      resourceType: readString(payload.resource_type),
      resourceId: readString(payload.resource_id),
      resourceLabel: readString(payload.resource_label),
      category: readString(payload.category),
      severity: readString(payload.severity),
      status: readString(payload.status),
      ipAddress: request.headers.get("x-forwarded-for") ?? readString(payload.ip_address),
      userAgent: request.headers.get("user-agent") ?? readString(payload.user_agent),
      metadata:
        payload.metadata && typeof payload.metadata === "object"
          ? (payload.metadata as Record<string, unknown>)
          : {},
      occurredAt: readString(payload.occurred_at) ?? undefined,
    },
  })

  return NextResponse.json(result, { status: result.ok ? 200 : 400 })
}

function readString(value: unknown): string | null {
  return typeof value === "string" ? value : null
}
