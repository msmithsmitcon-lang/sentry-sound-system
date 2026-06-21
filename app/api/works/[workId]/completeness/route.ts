import { NextResponse } from "next/server"

import { getWorkCompleteness } from "@/lib/work-readiness/get-work-completeness"
import {
  WORK_COMPLETENESS_MODE,
  WORK_COMPLETENESS_SOURCE,
} from "@/lib/work-readiness/work-completeness.types"
import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context"

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(
  _request: Request,
  context: { params: Promise<{ workId: string }> }
) {
  const { workId } = await context.params

  if (!UUID_PATTERN.test(workId)) {
    return completenessErrorResponse("Invalid work ID.", 400)
  }

  try {
    const workspaceContext = await getAuthenticatedWorkspaceContext()
    const result = await getWorkCompleteness({
      workId,
      workspaceId: workspaceContext.workspace.id,
    })

    if (!result) {
      return completenessErrorResponse("Work not found.", 404)
    }

    return NextResponse.json(result)
  } catch (error) {
    return completenessErrorResponse(error)
  }
}

function completenessErrorResponse(error: unknown, explicitStatus?: number) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Work completeness request failed."

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
      source: WORK_COMPLETENESS_SOURCE,
      mode: WORK_COMPLETENESS_MODE,
    },
    { status }
  )
}
