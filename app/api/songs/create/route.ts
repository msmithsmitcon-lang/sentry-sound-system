import { NextResponse } from "next/server"

import { createSongWithContributors } from "@/lib/registration/services/create-song-with-contributors"
import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const context = await getAuthenticatedWorkspaceContext()

    const result = await createSongWithContributors(body, {
      workspaceId: context.workspace.id,
      createdByUserId: context.user.clerkUserId,
    })

    return NextResponse.json(result)
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unexpected create song error."
    const status = message === "Authentication required." ? 401 : 400

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status
      }
    )
  }
}
