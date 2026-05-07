import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {

  const url = new URL(req.url);

  const workspaceId =
    url.searchParams.get("workspace_id");

  let query = supabaseAdmin
    .from("workspace_members")
    .select("*")
    .order("created_at", {
      ascending: false
    });

  if (workspaceId) {
    query = query.eq(
      "workspace_id",
      workspaceId
    );
  }

  const { data, error } =
    await query;

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
    members: data
  });
}

export async function POST(req: Request) {

  const body = await req.json();

  const { data, error } =
    await supabaseAdmin
      .from("workspace_members")
      .insert({
        workspace_id:
          body.workspace_id,

        user_email:
          body.user_email,

        display_name:
          body.display_name ?? null,

        role:
          body.role ?? "member",

        status:
          body.status ?? "invited",

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

  await supabaseAdmin
    .from("workspace_activity")
    .insert({
      workspace_id:
        body.workspace_id,

      activity_type:
        "member_added",

      entity_type:
        "workspace_member",

      entity_id:
        data.id,

      message:
        `Added member ${data.user_email}`,

      performed_by:
        body.performed_by ?? "system"
    });

  return NextResponse.json({
    ok: true,
    member: data
  });
}
