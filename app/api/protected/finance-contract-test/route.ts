import { NextResponse } from "next/server"
import { protectedFinanceRoute } from "@/lib/finance/auth/protected-finance-route"
import type { FinanceApiResponse } from "@/lib/finance/contracts/finance-api-response"

type ContractTestData = {
  status: "protected"
  module: "finance"
}

export async function GET() {
  try {
    const session = await protectedFinanceRoute()

    const response: FinanceApiResponse<ContractTestData> = {
      success: true,
      data: {
        status: "protected",
        module: "finance",
      },
      meta: {
        workspaceId: "system",
        generatedAt: new Date().toISOString(),
      },
    }

    return NextResponse.json(response)
  } catch {
    const response: FinanceApiResponse<null> = {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required",
      },
    }

    return NextResponse.json(response, { status: 401 })
  }
}
