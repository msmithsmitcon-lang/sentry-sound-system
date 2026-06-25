import { prisma } from "@/lib/db/prisma"

export type WorkspaceMoneyStateTotals = {
  recorded_income_total: number
  recorded_expense_total: number
  expected_receivables_total: number
  outstanding_payables_total: number
  open_commitments_total: number
  mandatory_commitments_total: number
  high_risk_commitments_total: number
  overdue_commitments_count: number
  critical_commitments_count: number
  payable_linked_commitments_total: number
}

export async function getWorkspaceMoneyStateTotals(
  workspaceId: string
): Promise<WorkspaceMoneyStateTotals> {
  const rows = await prisma.$queryRaw<Array<{
    recorded_income_total: number | string | null
    recorded_expense_total: number | string | null
    expected_receivables_total: number | string | null
    outstanding_payables_total: number | string | null
    open_commitments_total: number | string | null
    mandatory_commitments_total: number | string | null
    high_risk_commitments_total: number | string | null
    overdue_commitments_count: number | string | null
    critical_commitments_count: number | string | null
    payable_linked_commitments_total: number | string | null
  }>>`
    SELECT
      COALESCE((
        SELECT SUM(amount)
        FROM workspace_finance_transactions
        WHERE workspace_id = ${workspaceId}::uuid
          AND transaction_type = 'income'
          AND status IN ('posted', 'reconciled')
      ), 0) AS recorded_income_total,
      COALESCE((
        SELECT SUM(amount)
        FROM workspace_finance_transactions
        WHERE workspace_id = ${workspaceId}::uuid
          AND transaction_type = 'expense'
          AND status IN ('posted', 'reconciled')
      ), 0) AS recorded_expense_total,
      COALESCE((
        SELECT SUM(outstanding_amount)
        FROM workspace_finance_receivables
        WHERE workspace_id = ${workspaceId}::uuid
          AND status IN ('open', 'partial')
      ), 0) AS expected_receivables_total,
      COALESCE((
        SELECT SUM(outstanding_amount)
        FROM workspace_finance_payables
        WHERE workspace_id = ${workspaceId}::uuid
          AND status IN ('open', 'partial')
      ), 0) AS outstanding_payables_total,
      COALESCE((
        SELECT SUM(amount)
        FROM workspace_finance_commitments
        WHERE workspace_id = ${workspaceId}::uuid
          AND status IN ('planned', 'due', 'overdue', 'review_later')
          AND amount IS NOT NULL
      ), 0) AS open_commitments_total,
      COALESCE((
        SELECT SUM(amount)
        FROM workspace_finance_commitments
        WHERE workspace_id = ${workspaceId}::uuid
          AND status IN ('planned', 'due', 'overdue', 'review_later')
          AND commitment_nature = 'mandatory'
          AND amount IS NOT NULL
      ), 0) AS mandatory_commitments_total,
      COALESCE((
        SELECT SUM(amount)
        FROM workspace_finance_commitments
        WHERE workspace_id = ${workspaceId}::uuid
          AND status IN ('planned', 'due', 'overdue', 'review_later')
          AND commitment_risk_level IN ('high', 'critical')
          AND amount IS NOT NULL
      ), 0) AS high_risk_commitments_total,
      COALESCE((
        SELECT COUNT(*)
        FROM workspace_finance_commitments
        WHERE workspace_id = ${workspaceId}::uuid
          AND status = 'overdue'
      ), 0) AS overdue_commitments_count,
      COALESCE((
        SELECT COUNT(*)
        FROM workspace_finance_commitments
        WHERE workspace_id = ${workspaceId}::uuid
          AND status IN ('planned', 'due', 'overdue', 'review_later')
          AND commitment_risk_level = 'critical'
      ), 0) AS critical_commitments_count,
      COALESCE((
        SELECT SUM(amount)
        FROM workspace_finance_commitments
        WHERE workspace_id = ${workspaceId}::uuid
          AND status IN ('planned', 'due', 'overdue', 'review_later')
          AND amount IS NOT NULL
          AND related_entity_type IN ('finance_payable', 'workspace_finance_payable')
      ), 0) AS payable_linked_commitments_total
  `

  const row = rows[0]

  return {
    recorded_income_total: toNumber(row?.recorded_income_total),
    recorded_expense_total: toNumber(row?.recorded_expense_total),
    expected_receivables_total: toNumber(row?.expected_receivables_total),
    outstanding_payables_total: toNumber(row?.outstanding_payables_total),
    open_commitments_total: toNumber(row?.open_commitments_total),
    mandatory_commitments_total: toNumber(row?.mandatory_commitments_total),
    high_risk_commitments_total: toNumber(row?.high_risk_commitments_total),
    overdue_commitments_count: toNumber(row?.overdue_commitments_count),
    critical_commitments_count: toNumber(row?.critical_commitments_count),
    payable_linked_commitments_total: toNumber(row?.payable_linked_commitments_total),
  }
}

function toNumber(value: number | string | null | undefined) {
  return Number(value ?? 0)
}
