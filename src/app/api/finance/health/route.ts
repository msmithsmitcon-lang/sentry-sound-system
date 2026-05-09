import { NextResponse } from "next/server"
import { protectedFinanceRoute } from "@/lib/finance/auth/protected-finance-route"
import { FinanceApiResponse } from "@/lib/finance/contracts/finance-api-response"

type FinanceHealthResponse = {
  status: string
}

export async function GET() {
  try {
    const auth = await protectedFinanceRoute()

    const response: FinanceApiResponse<FinanceHealthResponse> = {
      success: true,
      data: {
        status: "healthy",
      },
      meta: {
        workspaceId: "system",
        generatedAt: new Date().toISOString(),
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: FinanceApiResponse<null> = {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required",
      },
    }

    return NextResponse.json(response, {
      status: 401,
    })
  }
}
