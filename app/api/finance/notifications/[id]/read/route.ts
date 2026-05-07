import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const notificationId = params.id;

  const { data, error } = await supabaseAdmin
    .from("finance_notifications")
    .update({
      is_read: true
    })
    .eq("id", notificationId)
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
    notification: data
  });
}