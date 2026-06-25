import { NextResponse } from "next/server"

import { updateWorkspaceFinanceCommitmentAction } from "@/lib/finance-v1/workspace-finance-service"
import { WORKSPACE_FINANCE_SOURCE } from "@/lib/finance-v1/workspace-finance.types"
import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ commitmentId: string }> }
) {
  try {
    const context = await getAuthenticatedWorkspaceContext()
    const { commitmentId } = await params
    const body = await request.json()

    const result = await updateWorkspaceFinanceCommitmentAction(
      {
        workspaceId: context.workspace.id,
        userId: context.user.clerkUserId,
        currency: context.workspace.base_currency,
      },
      commitmentId,
      body
    )

    return NextResponse.json(result)
  } catch (error) {
    return financeErrorResponse(error)
  }
}

function financeErrorResponse(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Finance commitment update failed."
  const status =
    message === "Authentication required."
      ? 401
      : message === "Finance commitment not found."
        ? 404
        : 400

  return NextResponse.json(
    {
      success: false,
      error: message,
      source: WORKSPACE_FINANCE_SOURCE,
    },
    { status }
  )
}
