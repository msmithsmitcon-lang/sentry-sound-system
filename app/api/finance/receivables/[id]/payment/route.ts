import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const receivableId = params.id;

  const body = await req.json();

  const paymentAmount = Number(body.amount);

  if (paymentAmount <= 0) {
    return NextResponse.json(
      { ok: false, error: "Invalid payment amount" },
      { status: 400 }
    );
  }

  const { data: receivable, error: receivableError } =
    await supabaseAdmin
      .from("finance_receivables")
      .select("*")
      .eq("id", receivableId)
      .single();

  if (receivableError) {
    return NextResponse.json(
      { ok: false, error: receivableError.message },
      { status: 500 }
    );
  }

  if (paymentAmount > Number(receivable.outstanding_amount)) {
    return NextResponse.json(
      { ok: false, error: "Payment exceeds outstanding amount" },
      { status: 400 }
    );
  }

  const updatedOutstanding =
    Number(receivable.outstanding_amount) - paymentAmount;

  let status = "partial";

  if (updatedOutstanding === 0) {
    status = "paid";
  }

  const { data: updatedReceivable, error: updateError } =
    await supabaseAdmin
      .from("finance_receivables")
      .update({
        outstanding_amount: updatedOutstanding,
        status
      })
      .eq("id", receivableId)
      .select("*")
      .single();

  if (updateError) {
    return NextResponse.json(
      { ok: false, error: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    receivable: updatedReceivable
  });
}