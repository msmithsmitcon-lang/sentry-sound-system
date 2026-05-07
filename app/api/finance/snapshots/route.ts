import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const { data, error } = await supabaseAdmin
    .from("finance_snapshots")
    .select("*")
    .order("snapshot_date", { ascending: false });

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    snapshots: data
  });
}

export async function POST(req: Request) {

  const body = await req.json();

  const { data: accounts } = await supabaseAdmin
    .from("finance_accounts")
    .select("*");

  const { data: receivables } = await supabaseAdmin
    .from("finance_receivables")
    .select("*");

  const { data: payables } = await supabaseAdmin
    .from("finance_payables")
    .select("*");

  const snapshotData = {
    accounts,
    receivables,
    payables
  };

  const { data, error } = await supabaseAdmin
    .from("finance_snapshots")
    .insert({
      snapshot_date:
        body.snapshot_date ??
        new Date().toISOString().split("T")[0],

      snapshot_type:
        body.snapshot_type ?? "manual",

      data: snapshotData
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    snapshot: data
  });
}
