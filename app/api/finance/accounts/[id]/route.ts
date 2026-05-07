import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const accountId = params.id;

  const { data: account, error: accountError } = await supabaseAdmin
    .from("finance_accounts")
    .select("*")
    .eq("id", accountId)
    .single();

  if (accountError) {
    return NextResponse.json({ ok: false, error: accountError.message }, { status: 500 });
  }

  const { data: transactions, error: transactionError } = await supabaseAdmin
    .from("finance_transactions")
    .select(`
      *,
      debit_account:debit_account_id (id, name, code, type),
      credit_account:credit_account_id (id, name, code, type)
    `)
    .or(`debit_account_id.eq.${accountId},credit_account_id.eq.${accountId}`)
    .order("created_at", { ascending: false });

  if (transactionError) {
    return NextResponse.json({ ok: false, error: transactionError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, account, transactions });
}