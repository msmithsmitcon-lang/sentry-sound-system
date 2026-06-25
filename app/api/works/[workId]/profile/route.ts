import { NextResponse } from "next/server"

import { updateWorkProfile } from "@/lib/works/update-work-profile"
import {
  WORK_PROFILE_UPDATE_MODE,
  WORK_PROFILE_UPDATE_SOURCE,
} from "@/lib/works/work-profile-update.types"
import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context"

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function PATCH(
  request: Request,
  context: { params: Promise<{ workId: string }> }
) {
  const { workId } = await context.params

  if (!UUID_PATTERN.test(workId)) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid work ID.",
        source: WORK_PROFILE_UPDATE_SOURCE,
        mode: WORK_PROFILE_UPDATE_MODE,
      },
      { status: 400 }
    )
  }

  try {
    const body = await request.json()
    const context = await getAuthenticatedWorkspaceContext()
    const result = await updateWorkProfile(workId, context.workspace.id, body)

    return NextResponse.json(result)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update work profile."
    const status =
      message === "Authentication required."
        ? 401
        : message === "Work not found."
          ? 404
          : 400

    return NextResponse.json(
      {
        success: false,
        error: status === 401 ? message : message,
        source: WORK_PROFILE_UPDATE_SOURCE,
        mode: WORK_PROFILE_UPDATE_MODE,
      },
      { status }
    )
  }
}
