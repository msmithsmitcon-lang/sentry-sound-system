export type TransactionTypeFilter = "all" | "income" | "expense" | "transfer"
export type TransactionStatusFilter = "all" | "draft" | "posted" | "reconciled" | "void"

export type TransactionSortField =
  | "transactionDate"
  | "amount"
  | "description"
  | "status"

export type TransactionSortDirection = "asc" | "desc"

export type ValidatedTransactionsQuery = {
  page: number
  pageSize: number
  type: TransactionTypeFilter
  status: TransactionStatusFilter
  search: string
  sortBy: TransactionSortField
  sortDirection: TransactionSortDirection
}

const allowedTypes: TransactionTypeFilter[] = ["all", "income", "expense", "transfer"]
const allowedStatuses: TransactionStatusFilter[] = ["all", "draft", "posted", "reconciled", "void"]
const allowedSortFields: TransactionSortField[] = ["transactionDate", "amount", "description", "status"]
const allowedSortDirections: TransactionSortDirection[] = ["asc", "desc"]

export function validateTransactionsQuery(input: {
  page?: unknown
  pageSize?: unknown
  type?: unknown
  status?: unknown
  search?: unknown
  sortBy?: unknown
  sortDirection?: unknown
}): ValidatedTransactionsQuery {
  const parsedPage = Number(input.page ?? 1)
  const parsedPageSize = Number(input.pageSize ?? 20)

  const type = allowedTypes.includes(input.type as TransactionTypeFilter)
    ? (input.type as TransactionTypeFilter)
    : "all"

  const status = allowedStatuses.includes(input.status as TransactionStatusFilter)
    ? (input.status as TransactionStatusFilter)
    : "all"

  const sortBy = allowedSortFields.includes(input.sortBy as TransactionSortField)
    ? (input.sortBy as TransactionSortField)
    : "transactionDate"

  const sortDirection = allowedSortDirections.includes(input.sortDirection as TransactionSortDirection)
    ? (input.sortDirection as TransactionSortDirection)
    : "desc"

  return {
    page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1,
    pageSize:
      Number.isFinite(parsedPageSize) && parsedPageSize > 0
        ? Math.min(parsedPageSize, 100)
        : 20,
    type,
    status,
    search: typeof input.search === "string" ? input.search.trim().slice(0, 100) : "",
    sortBy,
    sortDirection,
  }
}
