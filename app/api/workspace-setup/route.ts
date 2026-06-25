import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context"
import {
  getWorkspaceSetupV1Summary,
  saveWorkspaceSetupV1,
  WorkspaceSetupV1Payload,
} from "@/lib/workspace-setup/workspace-setup-v1"
import { workspaceSetupV1SupabaseRepository } from "@/lib/workspace-setup/workspace-setup-v1-supabase"

export async function GET() {
  try {
    const context = await getAuthenticatedWorkspaceContext()
    const workspaceId = context.workspace?.id

    if (!workspaceId) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "WORKSPACE_CONTEXT_REQUIRED",
            message: "Workspace context is required.",
          },
        },
        { status: 400 }
      )
    }

    const result = await getWorkspaceSetupV1Summary({
      repository: workspaceSetupV1SupabaseRepository,
      workspaceId,
    })

    return NextResponse.json(result, { status: result.ok ? 200 : 400 })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "WORKSPACE_SETUP_LOAD_FAILED",
          message:
            error instanceof Error
              ? error.message
              : "Failed to load workspace setup.",
        },
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await getAuthenticatedWorkspaceContext()
    const workspaceId = context.workspace?.id

    if (!workspaceId) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "WORKSPACE_CONTEXT_REQUIRED",
            message: "Workspace context is required.",
          },
        },
        { status: 400 }
      )
    }

    const body = await request.json().catch(() => null)
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "INVALID_JSON",
            message: "Request body must be JSON.",
          },
        },
        { status: 400 }
      )
    }

    const result = await saveWorkspaceSetupV1({
      repository: workspaceSetupV1SupabaseRepository,
      workspaceId,
      payload: body as WorkspaceSetupV1Payload,
    })

    return NextResponse.json(result, { status: result.ok ? 200 : 400 })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "WORKSPACE_SETUP_SAVE_FAILED",
          message:
            error instanceof Error
              ? error.message
              : "Failed to save workspace setup.",
        },
      },
      { status: 500 }
    )
  }
}
