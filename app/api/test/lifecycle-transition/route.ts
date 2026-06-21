import { NextRequest, NextResponse } from "next/server"

import { recordLifecycleTransition } from "@/lib/workflow/lifecycle-admin"
import { lifecycleAdminSupabaseRepository } from "@/lib/workflow/lifecycle-admin-supabase"

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
  const result = await recordLifecycleTransition({
    repository: lifecycleAdminSupabaseRepository,
    transition: {
      workspaceId: readString(payload.workspace_id),
      entityType: readString(payload.entity_type),
      entityId: readString(payload.entity_id),
      currentState: readString(payload.current_state),
      nextState: readString(payload.next_state),
      transitionKey: readString(payload.transition_key),
      actorUserId: readString(payload.actor_user_id),
      reason: readString(payload.reason),
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
