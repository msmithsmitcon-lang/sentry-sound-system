import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data: transactions, error } = await supabaseAdmin
    .from("finance_transactions")
    .select(`
      *,
      debit_account:debit_account_id (
        id,
        code,
        name,
        type
      ),
      credit_account:credit_account_id (
        id,
        code,
        name,
        type
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  let cashInflows = 0;
  let cashOutflows = 0;

  const cashTransactions = transactions.filter((transaction: any) => {
    const debitIsCash = transaction.debit_account?.type === "cash";
    const creditIsCash = transaction.credit_account?.type === "cash";
    return debitIsCash || creditIsCash;
  });

  for (const transaction of cashTransactions) {
    const amount = Number(transaction.amount);

    if (transaction.debit_account?.type === "cash") {
      cashInflows += amount;
    }

    if (transaction.credit_account?.type === "cash") {
      cashOutflows += amount;
    }
  }

  return NextResponse.json({
    ok: true,
    totals: {
      cash_inflows: cashInflows,
      cash_outflows: cashOutflows,
      net_cash_movement: cashInflows - cashOutflows
    },
    cash_transactions: cashTransactions
  });
}
