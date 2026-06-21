import { NextResponse } from "next/server"

import { updateWorkspaceCalendarItem } from "@/lib/calendar/workspace-calendar-service"
import { WORKSPACE_CALENDAR_SOURCE } from "@/lib/calendar/workspace-calendar.types"
import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context"

export async function PATCH(
  request: Request,
  context: { params: Promise<{ itemId: string }> }
) {
  try {
    const workspaceContext = await getAuthenticatedWorkspaceContext()
    const { itemId } = await context.params
    const body = await request.json()

    const result = await updateWorkspaceCalendarItem({
      workspaceId: workspaceContext.workspace.id,
      itemId,
      item: body,
    })

    return NextResponse.json(result)
  } catch (error) {
    return calendarErrorResponse(error)
  }
}

function calendarErrorResponse(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Calendar item update failed."
  const status =
    message === "Authentication required."
      ? 401
      : message === "Calendar item not found."
        ? 404
        : 400

  return NextResponse.json(
    {
      success: false,
      error: message,
      source: WORKSPACE_CALENDAR_SOURCE,
    },
    { status }
  )
}
