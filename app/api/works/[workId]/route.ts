import { NextResponse } from "next/server"

import { getWorkDetailReadModel } from "@/lib/works/get-work-detail-read-model"
import {
  WORK_DETAIL_READ_MODEL_MODE,
  WORK_DETAIL_READ_MODEL_SOURCE,
} from "@/lib/works/work-detail-read-model.types"
import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context"

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(
  _request: Request,
  context: { params: Promise<{ workId: string }> }
) {
  const { workId } = await context.params

  if (!UUID_PATTERN.test(workId)) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid work ID.",
        source: WORK_DETAIL_READ_MODEL_SOURCE,
        mode: WORK_DETAIL_READ_MODEL_MODE,
      },
      { status: 400 }
    )
  }

  try {
    const context = await getAuthenticatedWorkspaceContext()
    const result = await getWorkDetailReadModel(workId, context.workspace.id)

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: "Work not found.",
          source: WORK_DETAIL_READ_MODEL_SOURCE,
          mode: WORK_DETAIL_READ_MODEL_MODE,
        },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("WORK_DETAIL_READ_MODEL_ERROR:", error)

    const message =
      error instanceof Error
        ? error.message
        : "Failed to load work detail read model."
    const status = message === "Authentication required." ? 401 : 500

    return NextResponse.json(
      {
        success: false,
        error: status === 401 ? message : "Failed to load work detail read model.",
        source: WORK_DETAIL_READ_MODEL_SOURCE,
        mode: WORK_DETAIL_READ_MODEL_MODE,
      },
      { status }
    )
  }
}
