import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {

  const body = await req.json();

  const amount =
    Number(body.amount);

  if (amount <= 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid amount"
      },
      {
        status: 400
      }
    );
  }

  const { data, error } =
    await supabaseAdmin
      .from("finance_exchange_rates")
      .select("*")
      .eq(
        "base_currency",
        body.base_currency
      )
      .eq(
        "target_currency",
        body.target_currency
      )
      .order("effective_date", {
        ascending: false
      })
      .limit(1)
      .maybeSingle();

  if (error || !data) {
    return NextResponse.json(
      {
        ok: false,
        error: "Exchange rate not found"
      },
      {
        status: 404
      }
    );
  }

  const convertedAmount =
    amount *
    Number(data.exchange_rate);

  return NextResponse.json({
    ok: true,

    conversion: {
      original_amount:
        amount,

      base_currency:
        body.base_currency,

      target_currency:
        body.target_currency,

      exchange_rate:
        Number(data.exchange_rate),

      converted_amount:
        Number(
          convertedAmount.toFixed(2)
        )
    }
  });
}
