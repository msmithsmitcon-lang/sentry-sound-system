import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data: accounts, error: accountsError } = await supabaseAdmin
    .from("finance_accounts")
    .select("*");

  if (accountsError) {
    return NextResponse.json(
      { ok: false, error: accountsError.message },
      { status: 500 }
    );
  }

  const { data: transactions, error: transactionsError } = await supabaseAdmin
    .from("finance_transactions")
    .select("*");

  if (transactionsError) {
    return NextResponse.json(
      { ok: false, error: transactionsError.message },
      { status: 500 }
    );
  }

  const trialDebit = accounts.reduce((sum, account) => {
    const balance = Number(account.current_balance);
    return sum + (balance > 0 ? balance : 0);
  }, 0);

  const trialCredit = accounts.reduce((sum, account) => {
    const balance = Number(account.current_balance);
    return sum + (balance < 0 ? Math.abs(balance) : 0);
  }, 0);

  const unreconciledCount = transactions.filter(
    (transaction) => transaction.reconciliation_status !== "reconciled"
  ).length;

  return NextResponse.json({
    ok: true,
    health: {
      trial_balance_balanced: trialDebit === trialCredit,
      trial_debit: trialDebit,
      trial_credit: trialCredit,
      account_count: accounts.length,
      transaction_count: transactions.length,
      unreconciled_transaction_count: unreconciledCount
    }
  });
}
