import { NextRequest, NextResponse } from "next/server"

import { createAsset, listAssets } from "@/lib/assets/asset-admin"
import { assetAdminSupabaseRepository } from "@/lib/assets/asset-admin-supabase"

export async function GET(request: NextRequest) {
  const limitParam = request.nextUrl.searchParams.get("limit")
  const result = await listAssets({
    repository: assetAdminSupabaseRepository,
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
  const result = await createAsset({
    repository: assetAdminSupabaseRepository,
    asset: {
      workspaceId: readString(payload.workspace_id),
      assetId: readString(payload.asset_id),
      assetType: readString(payload.asset_type),
      assetCategory: readString(payload.asset_category),
      title: readString(payload.title) ?? readString(payload.name),
      fileName: readString(payload.file_name),
      mimeType: readString(payload.mime_type),
      fileSizeBytes:
        typeof payload.file_size_bytes === "number"
          ? payload.file_size_bytes
          : null,
      storagePath: readString(payload.storage_path),
      status: readString(payload.status),
      linkedEntityType: readString(payload.linked_entity_type),
      linkedEntityId: readString(payload.linked_entity_id),
      tags: Array.isArray(payload.tags)
        ? payload.tags.filter((tag): tag is string => typeof tag === "string")
        : [],
      metadata:
        payload.metadata && typeof payload.metadata === "object"
          ? (payload.metadata as Record<string, unknown>)
          : {},
      createdBy: readString(payload.created_by),
      createdAt: readString(payload.created_at) ?? undefined,
    },
  })

  return NextResponse.json(result, { status: result.ok ? 200 : 400 })
}

function readString(value: unknown): string | null {
  return typeof value === "string" ? value : null
}
