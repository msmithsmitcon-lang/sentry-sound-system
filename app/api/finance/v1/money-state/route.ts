import { NextResponse } from "next/server"

import { getWorkspaceMoneyState } from "@/lib/finance-v1/workspace-money-state-service"
import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context"

const MONEY_STATE_SOURCE = "finance_money_state_v0"

export async function GET() {
  try {
    const context = await getAuthenticatedWorkspaceContext()

    const result = await getWorkspaceMoneyState({
      workspaceId: context.workspace.id,
      currency: context.workspace.base_currency,
    })

    return NextResponse.json(result)
  } catch (error) {
    return moneyStateErrorResponse(error)
  }
}

function moneyStateErrorResponse(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Money State request failed."
  const status = message === "Authentication required." ? 401 : 400

  return NextResponse.json(
    {
      success: false,
      error: message,
      source: MONEY_STATE_SOURCE,
    },
    { status }
  )
}
