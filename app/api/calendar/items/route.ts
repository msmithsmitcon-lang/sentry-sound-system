import { NextRequest, NextResponse } from "next/server"

import {
  createWorkspaceCalendarItem,
  getWorkspaceCalendar,
} from "@/lib/calendar/workspace-calendar-service"
import { WORKSPACE_CALENDAR_SOURCE } from "@/lib/calendar/workspace-calendar.types"
import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context"

export async function GET(request: NextRequest) {
  try {
    const context = await getAuthenticatedWorkspaceContext()
    const startDate = request.nextUrl.searchParams.get("start") ?? undefined
    const endDate = request.nextUrl.searchParams.get("end") ?? undefined

    const result = await getWorkspaceCalendar({
      workspaceId: context.workspace.id,
      currentUserId: context.user.clerkUserId,
      startDate,
      endDate,
    })

    return NextResponse.json(result)
  } catch (error) {
    return calendarErrorResponse(error)
  }
}

export async function POST(request: Request) {
  try {
    const context = await getAuthenticatedWorkspaceContext()
    const body = await request.json()

    const result = await createWorkspaceCalendarItem({
      workspaceId: context.workspace.id,
      createdByUserId: context.user.clerkUserId,
      item: body,
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return calendarErrorResponse(error)
  }
}

function calendarErrorResponse(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Calendar request failed."
  const status = message === "Authentication required." ? 401 : 400

  return NextResponse.json(
    {
      success: false,
      error: message,
      source: WORKSPACE_CALENDAR_SOURCE,
    },
    { status }
  )
}
