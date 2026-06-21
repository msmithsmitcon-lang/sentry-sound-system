import { NextResponse } from "next/server"

import {
  createWorkspaceFinanceCommitmentRecord,
  getWorkspaceFinanceCommitmentList,
} from "@/lib/finance-v1/workspace-finance-service"
import { WORKSPACE_FINANCE_SOURCE } from "@/lib/finance-v1/workspace-finance.types"
import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context"

export async function GET() {
  try {
    const context = await getAuthenticatedWorkspaceContext()

    const result = await getWorkspaceFinanceCommitmentList({
      workspaceId: context.workspace.id,
      userId: context.user.clerkUserId,
      currency: context.workspace.base_currency,
    })

    return NextResponse.json(result)
  } catch (error) {
    return financeErrorResponse(error)
  }
}

export async function POST(request: Request) {
  try {
    const context = await getAuthenticatedWorkspaceContext()
    const body = await request.json()

    const result = await createWorkspaceFinanceCommitmentRecord(
      {
        workspaceId: context.workspace.id,
        userId: context.user.clerkUserId,
        currency: context.workspace.base_currency,
      },
      body
    )

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return financeErrorResponse(error)
  }
}

function financeErrorResponse(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Finance commitment request failed."
  const status = message === "Authentication required." ? 401 : 400

  return NextResponse.json(
    {
      success: false,
      error: message,
      source: WORKSPACE_FINANCE_SOURCE,
    },
    { status }
  )
}
