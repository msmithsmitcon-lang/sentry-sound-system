import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {

  const url = new URL(req.url);

  const countryCode =
    url.searchParams.get("country_code");

  let query = supabaseAdmin
    .from("finance_country_currency")
    .select("*");

  if (countryCode) {
    query = query.eq(
      "country_code",
      countryCode.toUpperCase()
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

  return NextResponse.json({
    ok: true,
    countries: data
  });
}
