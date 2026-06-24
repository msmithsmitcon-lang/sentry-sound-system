import { NextResponse } from "next/server"

import { listWorkAssets, uploadWorkAsset } from "@/lib/work-files/work-asset-upload-service"
import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context"

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Real, storage-backed work asset upload route.
 *
 * Distinct from /api/works/[workId]/files, which is a reference-only
 * metadata tracker (see work-supporting-materials-service.ts —
 * `realFileUpload: false` in its own records). This route uploads actual
 * bytes to Supabase Storage and records a verifiable SHA-256 checksum,
 * which the proof-of-collaboration certificate (Phase 4) depends on.
 */

export async function GET(
  _request: Request,
  context: { params: Promise<{ workId: string }> }
) {
  const { workId } = await context.params

  if (!UUID_PATTERN.test(workId)) {
    return workAssetsErrorResponse("Invalid work ID.", 400)
  }

  try {
    const workspaceContext = await getAuthenticatedWorkspaceContext()
    const result = await listWorkAssets({
      workId,
      workspaceId: workspaceContext.workspace.id,
    })

    return NextResponse.json(result)
  } catch (error) {
    return workAssetsErrorResponse(error)
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ workId: string }> }
) {
  const { workId } = await context.params

  if (!UUID_PATTERN.test(workId)) {
    return workAssetsErrorResponse("Invalid work ID.", 400)
  }

  try {
    const workspaceContext = await getAuthenticatedWorkspaceContext()

    const formData = await request.formData()
    const file = formData.get("file")
    const fileCategory = formData.get("file_category")

    if (!(file instanceof File)) {
      return workAssetsErrorResponse("A file is required.", 400)
    }

    const bytes = Buffer.from(await file.arrayBuffer())

    const result = await uploadWorkAsset({
      workId,
      workspaceId: workspaceContext.workspace.id,
      createdByUserId: workspaceContext.user.clerkUserId,
      fileName: file.name,
      fileCategory,
      mimeType: file.type || null,
      bytes,
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return workAssetsErrorResponse(error)
  }
}

function workAssetsErrorResponse(error: unknown, explicitStatus?: number) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Work asset request failed."

  const status =
    explicitStatus ??
    (message === "Authentication required."
      ? 401
      : message === "Work not found."
        ? 404
        : 400)

  return NextResponse.json({ success: false, error: message }, { status })
}
