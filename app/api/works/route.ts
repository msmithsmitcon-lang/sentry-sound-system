import { NextRequest, NextResponse } from "next/server"

import { getWorksReadModel } from "@/lib/works/get-works-read-model"
import {
  WORKS_READ_MODEL_MODE,
  WORKS_READ_MODEL_SOURCE,
} from "@/lib/works/works-read-model.types"
import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context"

export async function GET(request: NextRequest) {
  try {
    const limitParam = request.nextUrl.searchParams.get("limit")
    const limit = limitParam ? Number(limitParam) : undefined
    const context = await getAuthenticatedWorkspaceContext()

    const result = await getWorksReadModel({
      limit: Number.isFinite(limit) ? limit : undefined,
      workspaceId: context.workspace.id,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("WORKS_READ_MODEL_ERROR:", error)

    const message =
      error instanceof Error ? error.message : "Failed to load works read model."
    const status = message === "Authentication required." ? 401 : 500

    return NextResponse.json(
      {
        success: false,
        error: status === 401 ? message : "Failed to load works read model.",
        source: WORKS_READ_MODEL_SOURCE,
        mode: WORKS_READ_MODEL_MODE,
      },
      {
        status,
      }
    )
  }
}
