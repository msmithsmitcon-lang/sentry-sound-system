import { NextRequest, NextResponse } from "next/server"

import { createContributor, listContributors } from "@/lib/contributors/contributor-admin"
import { contributorAdminSupabaseRepository } from "@/lib/contributors/contributor-admin-supabase"

export async function GET(request: NextRequest) {
  const limitParam = request.nextUrl.searchParams.get("limit")
  const result = await listContributors({
    repository: contributorAdminSupabaseRepository,
    workspaceId: request.nextUrl.searchParams.get("workspace_id"),
    limit: limitParam ? Number(limitParam) : undefined,
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
        error: { code: "INVALID_JSON", message: "Request body must be JSON." },
      },
      { status: 400 }
    )
  }

  const payload = body as Record<string, unknown>
  const result = await createContributor({
    repository: contributorAdminSupabaseRepository,
    contributor: {
      workspaceId: readString(payload.workspace_id),
      contributorId: readString(payload.contributor_id),
      displayName: readString(payload.display_name),
      legalName: readString(payload.legal_name),
      email: readString(payload.email),
      contributorType: readString(payload.contributor_type),
      roles: Array.isArray(payload.roles)
        ? payload.roles.filter((role): role is string => typeof role === "string")
        : [],
      ipiCae: readString(payload.ipi_cae),
      proAffiliation: readString(payload.pro_affiliation),
      country: readString(payload.country),
      verificationStatus: readString(payload.verification_status),
      metadata:
        payload.metadata && typeof payload.metadata === "object"
          ? (payload.metadata as Record<string, unknown>)
          : {},
      createdAt: readString(payload.created_at) ?? undefined,
    },
  })

  return NextResponse.json(result, { status: result.ok ? 200 : 400 })
}

function readString(value: unknown): string | null {
  return typeof value === "string" ? value : null
}
