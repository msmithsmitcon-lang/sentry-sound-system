export type ProtectedFinanceDashboardSummary = {
  module: "finance"
  view: "dashboard-summary"
  cards: {
    totalIncome: number
    totalExpenses: number
    netPosition: number
    pendingApprovals: number
  }
  uiHints: {
    layout: "dashboard-cards"
    priority: "high"
  }
}

export async function getProtectedFinanceDashboardSummary(): Promise<ProtectedFinanceDashboardSummary> {
  return {
    module: "finance",
    view: "dashboard-summary",
    cards: {
      totalIncome: 0,
      totalExpenses: 0,
      netPosition: 0,
      pendingApprovals: 0,
    },
    uiHints: {
      layout: "dashboard-cards",
      priority: "high",
    },
  }
}
