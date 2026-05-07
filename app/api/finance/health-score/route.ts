import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const { data: accounts } =
    await supabaseAdmin
      .from("finance_accounts")
      .select("*");

  const { data: receivables } =
    await supabaseAdmin
      .from("finance_receivables")
      .select("*");

  const { data: payables } =
    await supabaseAdmin
      .from("finance_payables")
      .select("*");

  const { data: approvals } =
    await supabaseAdmin
      .from("finance_approvals")
      .select("*");

  let score = 100;

  const cash =
    accounts
      ?.filter((a) => a.type === "cash")
      .reduce(
        (sum, a) =>
          sum +
          Number(a.current_balance),
        0
      ) ?? 0;

  if (cash < 1000) {
    score -= 25;
  }

  const overdueReceivables =
    receivables
      ?.filter(
        (r) =>
          r.status !== "paid" &&
          r.due_date &&
          r.due_date <
          new Date()
            .toISOString()
            .split("T")[0]
      )
      .length ?? 0;

  score -= overdueReceivables * 5;

  const overduePayables =
    payables
      ?.filter(
        (p) =>
          p.status !== "paid" &&
          p.due_date &&
          p.due_date <
          new Date()
            .toISOString()
            .split("T")[0]
      )
      .length ?? 0;

  score -= overduePayables * 5;

  const pendingApprovals =
    approvals
      ?.filter(
        (a) =>
          a.status === "pending"
      )
      .length ?? 0;

  score -= pendingApprovals * 2;

  if (score < 0) {
    score = 0;
  }

  let status = "excellent";

  if (score < 80) {
    status = "good";
  }

  if (score < 60) {
    status = "warning";
  }

  if (score < 40) {
    status = "critical";
  }

  return NextResponse.json({
    ok: true,

    finance_health: {
      score,
      status,

      factors: {
        cash_position:
          cash,

        overdue_receivables:
          overdueReceivables,

        overdue_payables:
          overduePayables,

        pending_approvals:
          pendingApprovals
      }
    }
  });
}
