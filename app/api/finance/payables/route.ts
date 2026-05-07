import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const { data, error } = await supabaseAdmin
    .from("finance_payables")
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
    payables: data
  });
}

export async function POST(req: Request) {

  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("finance_payables")
    .insert({
      vendor_name: body.vendor_name,
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
    payable: data
  });
}
