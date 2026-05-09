export type ProtectedFinanceApiRegistryItem = {
  key: string
  path: string
  method: "GET" | "POST" | "PATCH" | "DELETE"
  protection: "auth-required"
  contractStatus: "draft" | "active"
  uiPurpose: string
}

export const protectedFinanceApiRegistry: ProtectedFinanceApiRegistryItem[] = [
  {
    key: "finance.contractTest",
    path: "/api/protected/finance-contract-test",
    method: "GET",
    protection: "auth-required",
    contractStatus: "active",
    uiPurpose: "Verifies protected finance API response contract.",
  },
  {
    key: "finance.dashboardSummary",
    path: "/api/protected/finance/dashboard-summary",
    method: "GET",
    protection: "auth-required",
    contractStatus: "active",
    uiPurpose: "Provides finance dashboard cards for later UI generation.",
  },
  {
    key: "finance.transactions.list",
    path: "/api/protected/finance/transactions",
    method: "GET",
    protection: "auth-required",
    contractStatus: "active",
    uiPurpose: "Provides paginated finance transaction rows for later data-table UI generation.",
  },
  {
    key: "finance.transactions.create",
    path: "/api/protected/finance/transactions",
    method: "POST",
    protection: "auth-required",
    contractStatus: "active",
    uiPurpose: "Creates finance transactions from future AI-generated forms and workflow screens.",
  },
  {
    key: "finance.transactions.update",
    path: "/api/protected/finance/transactions/:id",
    method: "PATCH",
    protection: "auth-required",
    contractStatus: "active",
    uiPurpose: "Updates finance transactions from future editable tables and workflow screens.",
  },
]
