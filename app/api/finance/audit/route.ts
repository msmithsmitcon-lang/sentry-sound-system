import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {

  const url = new URL(req.url);

  const referenceType =
    url.searchParams.get("reference_type");

  const accountCode =
    url.searchParams.get("account_code");

  let query = supabaseAdmin
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

  if (referenceType) {
    query = query.eq(
      "reference_type",
      referenceType
    );
  }

  const { data, error } = await query;

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

  let transactions = data;

  if (accountCode) {
    transactions = data.filter((transaction: any) => {

      return (
        transaction.debit_account?.code === accountCode ||
        transaction.credit_account?.code === accountCode
      );
    });
  }

  return NextResponse.json({
    ok: true,
    count: transactions.length,
    transactions
  });
}
