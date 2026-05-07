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

  const { data: notifications } =
    await supabaseAdmin
      .from("finance_notifications")
      .select("*");

  const cash =
    accounts
      ?.filter((a) => a.type === "cash")
      .reduce(
        (sum, a) =>
          sum +
          Number(a.current_balance),
        0
      ) ?? 0;

  const liabilities =
    accounts
      ?.filter((a) => a.type === "liability")
      .reduce(
        (sum, a) =>
          sum +
          Math.abs(
            Number(
              a.current_balance
            )
          ),
        0
      ) ?? 0;

  const outstandingReceivables =
    receivables
      ?.filter(
        (r) => r.status !== "paid"
      )
      .reduce(
        (sum, r) =>
          sum +
          Number(r.amount),
        0
      ) ?? 0;

  const outstandingPayables =
    payables
      ?.filter(
        (p) => p.status !== "paid"
      )
      .reduce(
        (sum, p) =>
          sum +
          Number(p.amount),
        0
      ) ?? 0;

  const pendingApprovals =
    approvals
      ?.filter(
        (a) => a.status === "pending"
      )
      .length ?? 0;

  const unreadNotifications =
    notifications
      ?.filter(
        (n) => n.is_read === false
      )
      .length ?? 0;

  return NextResponse.json({
    ok: true,

    dashboard: {

      cash_position:
        cash,

      total_liabilities:
        liabilities,

      outstanding_receivables:
        outstandingReceivables,

      outstanding_payables:
        outstandingPayables,

      pending_approvals:
        pendingApprovals,

      unread_notifications:
        unreadNotifications
    }
  });
}
