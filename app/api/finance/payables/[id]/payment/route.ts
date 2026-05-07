import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const payableId = params.id;

  const body = await req.json();

  const paymentAmount = Number(body.amount);

  if (paymentAmount <= 0) {
    return NextResponse.json(
      { ok: false, error: "Invalid payment amount" },
      { status: 400 }
    );
  }

  const { data: payable, error: payableError } =
    await supabaseAdmin
      .from("finance_payables")
      .select("*")
      .eq("id", payableId)
      .single();

  if (payableError) {
    return NextResponse.json(
      { ok: false, error: payableError.message },
      { status: 500 }
    );
  }

  if (paymentAmount > Number(payable.outstanding_amount)) {
    return NextResponse.json(
      { ok: false, error: "Payment exceeds outstanding amount" },
      { status: 400 }
    );
  }

  const updatedOutstanding =
    Number(payable.outstanding_amount) - paymentAmount;

  let status = "partial";

  if (updatedOutstanding === 0) {
    status = "paid";
  }

  const { data: updatedPayable, error: updateError } =
    await supabaseAdmin
      .from("finance_payables")
      .update({
        outstanding_amount: updatedOutstanding,
        status
      })
      .eq("id", payableId)
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
    payable: updatedPayable
  });
}