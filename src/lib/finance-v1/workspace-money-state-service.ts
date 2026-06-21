import type {
  WorkspaceMoneyState,
  WorkspaceMoneyStateResponse,
  WorkspaceMoneyStateStatus,
} from "./workspace-finance.types"
import { getWorkspaceMoneyStateTotals } from "./workspace-money-state-repository"

const MONEY_STATE_DISCLAIMER =
  "This is recorded-data awareness only. It is not a bank balance, cash availability statement, tax calculation, forecast, or financial advice. Review your records before making spending or compliance decisions."

type MoneyStateContext = {
  workspaceId: string
  currency?: string | null
}

export async function getWorkspaceMoneyState(
  context: MoneyStateContext
): Promise<WorkspaceMoneyStateResponse> {
  const currency = context.currency || "ZAR"
  const totals = await getWorkspaceMoneyStateTotals(context.workspaceId)
  const recordedNetPosition =
    totals.recorded_income_total - totals.recorded_expense_total
  const hasPossibleOverlap =
    totals.payable_linked_commitments_total > 0
  const responsibilityPressureTotal =
    totals.outstanding_payables_total +
    Math.max(0, totals.open_commitments_total - totals.payable_linked_commitments_total)
  const recordedPositionAfterResponsibilities =
    recordedNetPosition - responsibilityPressureTotal

  const flags = {
    has_overdue_commitments: totals.overdue_commitments_count > 0,
    has_critical_commitments: totals.critical_commitments_count > 0,
    has_outstanding_payables: totals.outstanding_payables_total > 0,
    has_negative_recorded_position: recordedNetPosition < 0,
    has_possible_overlap_between_commitments_and_payables: hasPossibleOverlap,
  }

  const moneyState: WorkspaceMoneyState = {
    currency,
    recorded_income_total: totals.recorded_income_total,
    recorded_expense_total: totals.recorded_expense_total,
    recorded_net_position: recordedNetPosition,
    expected_receivables_total: totals.expected_receivables_total,
    outstanding_payables_total: totals.outstanding_payables_total,
    open_commitments_total: totals.open_commitments_total,
    mandatory_commitments_total: totals.mandatory_commitments_total,
    high_risk_commitments_total: totals.high_risk_commitments_total,
    responsibility_pressure_total: responsibilityPressureTotal,
    recorded_position_after_responsibilities: recordedPositionAfterResponsibilities,
    status: getMoneyStateStatus({
      recordedNetPosition,
      responsibilityPressureTotal,
      recordedPositionAfterResponsibilities,
      hasAnyRecordedData:
        totals.recorded_income_total > 0 ||
        totals.recorded_expense_total > 0 ||
        totals.expected_receivables_total > 0 ||
        totals.outstanding_payables_total > 0 ||
        totals.open_commitments_total > 0,
      hasCriticalCommitments: flags.has_critical_commitments,
      hasOverdueCommitments: flags.has_overdue_commitments,
      hasOutstandingPayables: flags.has_outstanding_payables,
    }),
    flags,
    disclaimer: MONEY_STATE_DISCLAIMER,
  }

  return {
    success: true,
    source: "finance_money_state_v0",
    mode: "recorded_awareness",
    money_state: moneyState,
  }
}

function getMoneyStateStatus(input: {
  recordedNetPosition: number
  responsibilityPressureTotal: number
  recordedPositionAfterResponsibilities: number
  hasAnyRecordedData: boolean
  hasCriticalCommitments: boolean
  hasOverdueCommitments: boolean
  hasOutstandingPayables: boolean
}): WorkspaceMoneyStateStatus {
  if (!input.hasAnyRecordedData) return "unknown"
  if (
    input.recordedNetPosition < 0 ||
    input.recordedPositionAfterResponsibilities < 0 ||
    input.hasCriticalCommitments ||
    input.hasOverdueCommitments
  ) {
    return "at_risk"
  }
  if (
    input.responsibilityPressureTotal > 0 &&
    input.responsibilityPressureTotal >= input.recordedNetPosition * 0.5
  ) {
    return "pressure"
  }
  if (input.responsibilityPressureTotal > 0 || input.hasOutstandingPayables) {
    return "attention"
  }
  return "stable"
}
