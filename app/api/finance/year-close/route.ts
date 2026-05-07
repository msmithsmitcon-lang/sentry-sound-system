import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const { data, error } =
    await supabaseAdmin
      .from("finance_year_closes")
      .select("*")
      .order("financial_year", {
        ascending: false
      });

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
    years: data
  });
}

export async function POST(req: Request) {

  const body = await req.json();

  const { data, error } =
    await supabaseAdmin
      .from("finance_year_closes")
      .insert({
        financial_year:
          body.financial_year,

        status:
          body.status ?? "open",

        close_notes:
          body.close_notes ?? null,

        metadata:
          body.metadata ?? {}
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
    year_close: data
  });
}
