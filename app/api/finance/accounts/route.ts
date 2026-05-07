import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("finance_accounts")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, accounts: data });
}

export async function POST(req: Request) {
  const body = await req.json();

  const required = ["name", "code", "type"];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json(
        { ok: false, error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }

  const allowedTypes = ["cash", "liability", "revenue", "expense"];
  if (!allowedTypes.includes(body.type)) {
    return NextResponse.json(
      { ok: false, error: "Invalid account type" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("finance_accounts")
    .insert({
      name: body.name,
      code: body.code,
      type: body.type,
      currency: body.currency ?? "ZAR",
      opening_balance: body.opening_balance ?? 0,
      current_balance: body.opening_balance ?? 0,
      metadata: body.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, account: data }, { status: 201 });
}
