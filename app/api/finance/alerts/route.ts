import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const alerts = [];

  const { data: accounts } = await supabaseAdmin
    .from("finance_accounts")
    .select("*");

  const { data: receivables } = await supabaseAdmin
    .from("finance_receivables")
    .select("*");

  const { data: payables } = await supabaseAdmin
    .from("finance_payables")
    .select("*");

  const { data: budgets } = await supabaseAdmin
    .from("finance_budgets")
    .select("*");

  const cash = accounts
    .filter((a) => a.type === "cash")
    .reduce(
      (sum, a) =>
        sum + Number(a.current_balance),
      0
    );

  if (cash < 1000) {
    alerts.push({
      type: "low_cash",
      severity: "high",
      message: "Cash position below threshold"
    });
  }

  const today =
    new Date().toISOString().split("T")[0];

  const overdueReceivables =
    receivables.filter(
      (r) =>
        r.due_date &&
        r.due_date < today &&
        r.status !== "paid"
    );

  if (overdueReceivables.length > 0) {
    alerts.push({
      type: "overdue_receivables",
      severity: "medium",
      count: overdueReceivables.length,
      message: "Overdue receivables detected"
    });
  }

  const overduePayables =
    payables.filter(
      (p) =>
        p.due_date &&
        p.due_date < today &&
        p.status !== "paid"
    );

  if (overduePayables.length > 0) {
    alerts.push({
      type: "overdue_payables",
      severity: "medium",
      count: overduePayables.length,
      message: "Overdue payables detected"
    });
  }

  for (const budget of budgets) {

    const matchingAccount =
      accounts.find(
        (a) => a.code === budget.account_code
      );

    if (!matchingAccount) {
      continue;
    }

    const actual =
      Math.abs(
        Number(
          matchingAccount.current_balance
        )
      );

    if (actual > Number(budget.planned_amount)) {

      alerts.push({
        type: "budget_overrun",
        severity: "medium",

        account_code:
          budget.account_code,

        message:
          `${budget.name} exceeded budget`
      });
    }
  }

  return NextResponse.json({
    ok: true,
    alert_count: alerts.length,
    alerts
  });
}
