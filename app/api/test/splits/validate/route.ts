import { NextRequest, NextResponse } from "next/server"

import { validateContributorSplits } from "@/lib/contributors/contributor-admin"

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
  const splits = Array.isArray(payload.splits)
    ? payload.splits
        .filter((split): split is Record<string, unknown> =>
          Boolean(split && typeof split === "object")
        )
        .map((split) => ({
          contributorId: readString(split.contributor_id),
          role: readString(split.role),
          splitType: readString(split.split_type),
          percentage:
            typeof split.percentage === "number" ? split.percentage : null,
        }))
    : []

  const result = validateContributorSplits({
    workspaceId: readString(payload.workspace_id),
    linkedEntityType: readString(payload.linked_entity_type),
    linkedEntityId: readString(payload.linked_entity_id),
    splits,
  })

  return NextResponse.json(result, { status: result.ok ? 200 : 400 })
}

function readString(value: unknown): string | null {
  return typeof value === "string" ? value : null
}
