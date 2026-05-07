import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const { data, error } = await supabaseAdmin
    .from("finance_transactions")
    .select(`
      id,
      amount,
      reference_type,
      reference_id,
      description,
      reconciliation_status,
      created_at,

      debit_account:debit_account_id (
        code,
        name,
        type
      ),

      credit_account:credit_account_id (
        code,
        name,
        type
      )
    `)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message
      },
      {
        status: 500
      }
    );
  }

  const ledger = data.map((transaction) => ({
    transaction_id: transaction.id,

    date: transaction.created_at,

    reference_type: transaction.reference_type,
    reference_id: transaction.reference_id,

    debit_account_code: transaction.debit_account?.code,
    debit_account_name: transaction.debit_account?.name,

    credit_account_code: transaction.credit_account?.code,
    credit_account_name: transaction.credit_account?.name,

    amount: transaction.amount,

    reconciliation_status:
      transaction.reconciliation_status,

    description: transaction.description
  }));

  return NextResponse.json({
    ok: true,
    count: ledger.length,
    ledger
  });
}
