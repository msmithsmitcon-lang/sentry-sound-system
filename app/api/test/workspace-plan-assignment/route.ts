import { NextRequest, NextResponse } from "next/server"

import {
  assignWorkspacePlan,
} from "@/lib/entitlements"
import { workspaceSubscriptionAdminSupabaseRepository } from "@/lib/entitlements/workspace-subscription-admin-supabase"

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

  const result = await assignWorkspacePlan({
    repository: workspaceSubscriptionAdminSupabaseRepository,
    assignment: {
      workspaceId: String(body.workspace_id ?? ""),
      planKey: String(body.plan_key ?? ""),
      subscriptionStatus: String(body.subscription_status ?? ""),
      source: String(body.source ?? ""),
      isProductionEligible:
        typeof body.is_production_eligible === "boolean"
          ? body.is_production_eligible
          : undefined,
      effectiveFrom:
        typeof body.effective_from === "string" ? body.effective_from : undefined,
      effectiveUntil:
        typeof body.effective_until === "string" || body.effective_until === null
          ? body.effective_until
          : undefined,
      reason: typeof body.reason === "string" ? body.reason : null,
      actorId: typeof body.actor_id === "string" ? body.actor_id : null,
      metadata:
        body.metadata && typeof body.metadata === "object" ? body.metadata : {},
    },
  })

  return NextResponse.json(result, { status: result.ok ? 200 : 400 })
}
