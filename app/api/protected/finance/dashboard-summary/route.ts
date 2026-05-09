import { NextResponse } from "next/server"
import { protectedFinanceRoute } from "@/lib/finance/auth/protected-finance-route"
import { hasFinancePermission } from "@/lib/finance/auth/finance-permissions"
import type { FinanceApiResponse } from "@/lib/finance/contracts/finance-api-response"
import { getProtectedFinanceDashboardSummary } from "@/lib/finance/services/dashboard-summary-service"

export async function GET() {
  try {
    const context = await protectedFinanceRoute()

    if (!hasFinancePermission(context.role as any, "finance:read")) {
      const response: FinanceApiResponse<null> = {
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Insufficient permissions",
        },
      }

      return NextResponse.json(response, {
        status: 403,
      })
    }

    const data = await getProtectedFinanceDashboardSummary()

    const response: FinanceApiResponse<typeof data> = {
      success: true,
      data,
      meta: {
        workspaceId: context.workspaceId,
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

    return NextResponse.json(response, {
      status: 401,
    })
  }
}
