import { NextResponse } from "next/server"

import { getWorkspaceFinanceCommitmentList } from "@/lib/finance-v1/workspace-finance-service"
import {
  COMMITMENT_WEIGHTING_SOURCE,
  type CommitmentWeightingResponse,
} from "@/lib/finance-v1/workspace-commitment-weighting.types"
import { buildCommitmentWeighting } from "@/lib/finance-v1/workspace-commitment-weighting-service"
import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context"

export async function GET() {
  try {
    const context = await getAuthenticatedWorkspaceContext()
    const result = await getWorkspaceFinanceCommitmentList({
      workspaceId: context.workspace.id,
      userId: context.user.clerkUserId,
      currency: context.workspace.base_currency,
    })

    const response: CommitmentWeightingResponse = {
      success: true,
      source: COMMITMENT_WEIGHTING_SOURCE,
      mode: "computed_semantic_read_model",
      items: result.commitments.map((commitment) =>
        buildCommitmentWeighting(commitment)
      ),
    }

    return NextResponse.json(response)
  } catch (error) {
    return weightingErrorResponse(error)
  }
}

function weightingErrorResponse(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Commitment weighting request failed."
  const status = message === "Authentication required." ? 401 : 400

  return NextResponse.json(
    {
      success: false,
      error: message,
      source: COMMITMENT_WEIGHTING_SOURCE,
    },
    { status }
  )
}
