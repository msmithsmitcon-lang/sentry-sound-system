import { NextResponse } from "next/server"

import {
  getWorkSupportingMaterials,
  createWorkSupportingMaterial,
} from "@/lib/work-files/work-supporting-materials-service"
import {
  WORK_SUPPORTING_MATERIALS_MODE,
  WORK_SUPPORTING_MATERIALS_SOURCE,
} from "@/lib/work-files/work-supporting-materials.types"
import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context"

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(
  _request: Request,
  context: { params: Promise<{ workId: string }> }
) {
  const { workId } = await context.params

  if (!UUID_PATTERN.test(workId)) {
    return workFilesErrorResponse("Invalid work ID.", 400)
  }

  try {
    const workspaceContext = await getAuthenticatedWorkspaceContext()
    const result = await getWorkSupportingMaterials({
      workId,
      workspaceId: workspaceContext.workspace.id,
    })

    return NextResponse.json(result)
  } catch (error) {
    return workFilesErrorResponse(error)
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ workId: string }> }
) {
  const { workId } = await context.params

  if (!UUID_PATTERN.test(workId)) {
    return workFilesErrorResponse("Invalid work ID.", 400)
  }

  try {
    const workspaceContext = await getAuthenticatedWorkspaceContext()
    const body = await request.json()
    const result = await createWorkSupportingMaterial({
      workId,
      workspaceId: workspaceContext.workspace.id,
      createdByUserId: workspaceContext.user.clerkUserId,
      body,
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return workFilesErrorResponse(error)
  }
}

function workFilesErrorResponse(error: unknown, explicitStatus?: number) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Work supporting materials request failed."

  const status =
    explicitStatus ??
    (message === "Authentication required."
      ? 401
      : message === "Work not found."
        ? 404
        : 400)

  return NextResponse.json(
    {
      success: false,
      error: message,
      source: WORK_SUPPORTING_MATERIALS_SOURCE,
      mode: WORK_SUPPORTING_MATERIALS_MODE,
    },
    { status }
  )
}
