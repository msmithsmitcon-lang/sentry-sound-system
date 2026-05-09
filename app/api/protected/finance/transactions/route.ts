import { NextRequest, NextResponse } from "next/server"

import { protectedFinanceRoute } from "@/lib/finance/auth/protected-finance-route"
import { hasFinancePermission } from "@/lib/finance/auth/finance-permissions"

import type { FinanceApiResponse } from "@/lib/finance/contracts/finance-api-response"

import { getProtectedFinanceTransactions } from "@/lib/finance/services/transactions-service"
import { createFinanceTransaction } from "@/lib/finance/services/create-transaction-service"

import { validateTransactionsQuery } from "@/lib/finance/validation/transactions-query-validation"
import { validateCreateFinanceTransactionInput } from "@/lib/finance/validation/create-transaction-validation"

export async function GET(request: NextRequest) {
  try {

    const context =
      await protectedFinanceRoute()

    if (
      !hasFinancePermission(
        context.role as any,
        "finance:read"
      )
    ) {
      const response: FinanceApiResponse<null> = {
        success: false,
        error: {
          code: "FORBIDDEN",
          message:
            "Insufficient permissions",
        },
      }

      return NextResponse.json(
        response,
        {
          status: 403,
        }
      )
    }

    const searchParams =
      request.nextUrl.searchParams

    const query =
      validateTransactionsQuery({
        page:
          searchParams.get("page"),

        pageSize:
          searchParams.get("pageSize"),

        type:
          searchParams.get("type"),

        status:
          searchParams.get("status"),

        search:
          searchParams.get("search"),

        sortBy:
          searchParams.get("sortBy"),

        sortDirection:
          searchParams.get(
            "sortDirection"
          ),
      })

    const data =
      await getProtectedFinanceTransactions(
        query
      )

    const response:
      FinanceApiResponse<typeof data> = {
      success: true,
      data,
      meta: {
        workspaceId:
          context.workspaceId,

        generatedAt:
          new Date().toISOString(),
      },
    }

    return NextResponse.json(response)

  } catch {

    const response:
      FinanceApiResponse<null> = {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message:
          "Authentication required",
      },
    }

    return NextResponse.json(
      response,
      {
        status: 401,
      }
    )
  }
}

export async function POST(request: Request) {
  try {

    const context =
      await protectedFinanceRoute()

    if (
      !hasFinancePermission(
        context.role as any,
        "finance:write"
      )
    ) {
      const response:
        FinanceApiResponse<null> = {
        success: false,
        error: {
          code: "FORBIDDEN",
          message:
            "Insufficient permissions",
        },
      }

      return NextResponse.json(
        response,
        {
          status: 403,
        }
      )
    }

    const body =
      await request.json()

    const validated =
      validateCreateFinanceTransactionInput(
        body
      )

    const data =
      await createFinanceTransaction(validated, { actorId: context.userId, workspaceId: context.workspaceId })

    const response:
      FinanceApiResponse<typeof data> = {
      success: true,
      data,
      meta: {
        workspaceId:
          context.workspaceId,

        generatedAt:
          new Date().toISOString(),
      },
    }

    return NextResponse.json(
      response,
      {
        status: 201,
      }
    )

  } catch (error: any) {

    const isUnauthorized =
      error?.message === "UNAUTHORIZED"

    const response:
      FinanceApiResponse<null> = {
      success: false,
      error: {
        code:
          isUnauthorized
            ? "UNAUTHORIZED"
            : "CREATE_TRANSACTION_FAILED",

        message:
          isUnauthorized
            ? "Authentication required"
            : error?.message ?? "Unknown error",
      },
    }

    return NextResponse.json(
      response,
      {
        status: isUnauthorized ? 401 : 400,
      }
    )
  }
}


