import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const { data, error } = await supabaseAdmin
    .from("finance_receivables")
    .select("*")
    .order("created_at", { ascending: false });

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

  return NextResponse.json({
    ok: true,
    receivables: data
  });
}

export async function POST(req: Request) {

  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("finance_receivables")
    .insert({
      customer_name: body.customer_name,
      reference_code: body.reference_code,
      amount: body.amount,
      outstanding_amount: body.amount,
      due_date: body.due_date ?? null,
      metadata: body.metadata ?? {}
    })
    .select("*")
    .single();

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

  return NextResponse.json({
    ok: true,
    receivable: data
  });
}
