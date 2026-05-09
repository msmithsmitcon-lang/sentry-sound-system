import { supabaseAdmin } from "@/lib/supabaseAdmin"
import type { ValidatedTransactionsQuery } from "@/lib/finance/validation/transactions-query-validation"

export type ProtectedFinanceTransactionListItem = {
  id: string
  transactionDate: string
  description: string
  type: "income" | "expense" | "transfer"
  amount: number
  currency: string
  status: "draft" | "posted" | "reconciled" | "void"
}

export type ProtectedFinanceTransactionsResponse = {
  module: "finance"
  view: "transactions"
  items: ProtectedFinanceTransactionListItem[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
  query: ValidatedTransactionsQuery
  table: {
    columns: {
      key: keyof ProtectedFinanceTransactionListItem
      label: string
      type: "text" | "date" | "money" | "badge"
      sortable: boolean
    }[]
    filters: {
      key: string
      label: string
      options: string[]
    }[]
  }
  uiHints: {
    layout: "data-table"
    primaryAction: "create-transaction"
  }
}

export async function getProtectedFinanceTransactions(
  query: ValidatedTransactionsQuery
): Promise<ProtectedFinanceTransactionsResponse> {

  const from =
    (query.page - 1) * query.pageSize

  const to =
    from + query.pageSize - 1

  let dbQuery = supabaseAdmin
    .from("finance_transactions")
    .select(`
      id,
      amount,
      description,
      reconciliation_status,
      created_at,
      reference_type
    `, {
      count: "exact"
    })

  if (query.search) {
    dbQuery = dbQuery.ilike(
      "description",
      `%${query.search}%`
    )
  }

  if (query.type !== "all") {
    dbQuery = dbQuery.eq(
      "reference_type",
      query.type
    )
  }

  if (query.status !== "all") {
    dbQuery = dbQuery.eq(
      "reconciliation_status",
      query.status
    )
  }

  const ascending =
    query.sortDirection === "asc"

  dbQuery = dbQuery.order(
    query.sortBy === "transactionDate"
      ? "created_at"
      : query.sortBy,
    {
      ascending,
    }
  )

  dbQuery = dbQuery.range(from, to)

  const { data, error, count } =
    await dbQuery

  if (error) {
    throw new Error(error.message)
  }

  const items: ProtectedFinanceTransactionListItem[] =
    (data ?? []).map((transaction: any) => ({
      id: transaction.id,

      transactionDate:
        transaction.created_at,

      description:
        transaction.description ?? "",

      type:
        transaction.reference_type === "income"
          ? "income"
          : transaction.reference_type === "expense"
          ? "expense"
          : "transfer",

      amount:
        Number(transaction.amount ?? 0),

      currency: "ZAR",

      status:
        transaction.reconciliation_status === "reconciled"
          ? "reconciled"
          : "posted",
    }))

  const total =
    count ?? 0

  return {
    module: "finance",
    view: "transactions",

    items,

    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages:
        Math.ceil(total / query.pageSize),
    },

    query,

    table: {
      columns: [
        {
          key: "transactionDate",
          label: "Date",
          type: "date",
          sortable: true,
        },
        {
          key: "description",
          label: "Description",
          type: "text",
          sortable: true,
        },
        {
          key: "type",
          label: "Type",
          type: "badge",
          sortable: false,
        },
        {
          key: "amount",
          label: "Amount",
          type: "money",
          sortable: true,
        },
        {
          key: "currency",
          label: "Currency",
          type: "text",
          sortable: false,
        },
        {
          key: "status",
          label: "Status",
          type: "badge",
          sortable: true,
        },
      ],

      filters: [
        {
          key: "type",
          label: "Type",
          options: [
            "all",
            "income",
            "expense",
            "transfer",
          ],
        },
        {
          key: "status",
          label: "Status",
          options: [
            "all",
            "draft",
            "posted",
            "reconciled",
            "void",
          ],
        },
      ],
    },

    uiHints: {
      layout: "data-table",
      primaryAction:
        "create-transaction",
    },
  }
}

