import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  const params = await context.params;

  const approvalId = params.id;

  const body = await req.json();

  const allowedStatuses = [
    "approved",
    "rejected"
  ];

  if (
    !allowedStatuses.includes(body.status)
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid status"
      },
      {
        status: 400
      }
    );
  }

  const updateData: any = {
    status: body.status,
    approval_notes:
      body.approval_notes ?? null
  };

  if (body.status === "approved") {

    updateData.approved_by =
      body.performed_by ?? "system";

    updateData.approved_at =
      new Date().toISOString();
  }

  if (body.status === "rejected") {

    updateData.rejected_by =
      body.performed_by ?? "system";

    updateData.rejected_at =
      new Date().toISOString();
  }

  const { data, error } =
    await supabaseAdmin
      .from("finance_approvals")
      .update(updateData)
      .eq("id", approvalId)
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