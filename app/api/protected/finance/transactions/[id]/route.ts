import { NextResponse } from "next/server"

import { protectedFinanceRoute } from "@/lib/finance/auth/protected-finance-route"
import { hasFinancePermission } from "@/lib/finance/auth/finance-permissions"
import type { FinanceApiResponse } from "@/lib/finance/contracts/finance-api-response"

import { validateUpdateFinanceTransactionInput } from "@/lib/finance/validation/update-transaction-validation"
import { updateFinanceTransaction } from "@/lib/finance/services/update-transaction-service"

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string
    }>
  }
) {
  try {
    const routeContext = await protectedFinanceRoute()

    if (!hasFinancePermission(routeContext.role as any, "finance:write")) {
      const response: FinanceApiResponse<null> = {
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Insufficient permissions",
        },
      }

      return NextResponse.json(response, { status: 403 })
    }

    const params = await context.params
    const body = await request.json()

    const validated = validateUpdateFinanceTransactionInput(body)

    const data = await updateFinanceTransaction(params.id, validated, { actorId: routeContext.userId, workspaceId: routeContext.workspaceId })

    const response: FinanceApiResponse<typeof data> = {
      success: true,
      data,
      meta: {
        workspaceId: routeContext.workspaceId,
        generatedAt: new Date().toISOString(),
      },
    }

    return NextResponse.json(response)
  } catch (error: any) {
    const isUnauthorized = error?.message === "UNAUTHORIZED"

    const response: FinanceApiResponse<null> = {
      success: false,
      error: {
        code: isUnauthorized ? "UNAUTHORIZED" : "UPDATE_TRANSACTION_FAILED",
        message: isUnauthorized
          ? "Authentication required"
          : error?.message ?? "Unknown error",
      },
    }

    return NextResponse.json(response, {
      status: isUnauthorized ? 401 : 400,
    })
  }
}

