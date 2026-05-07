import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {

  const { data, error } =
    await supabaseAdmin
      .from("finance_approvals")
      .select("*")
      .order("created_at", {
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
    approvals: data
  });
}

export async function POST(req: Request) {

  const body = await req.json();

  const { data, error } =
    await supabaseAdmin
      .from("finance_approvals")
      .insert({
        approval_type:
          body.approval_type,

        entity_type:
          body.entity_type,

        entity_id:
          body.entity_id,

        requested_by:
          body.requested_by ?? null,

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
    approval: data
  });
}
