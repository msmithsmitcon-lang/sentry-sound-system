import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("workspaces")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, workspaces: data });
}

export async function POST(req: Request) {
  const body = await req.json();

  const { data: workspace, error } = await supabaseAdmin
    .from("workspaces")
    .insert({
      name: body.name,
      legal_name: body.legal_name ?? null,
      country_code: body.country_code ?? null,
      base_currency: body.base_currency ?? null,
      metadata: body.metadata ?? {}
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  await supabaseAdmin
    .from("workspace_settings")
    .insert({
      workspace_id: workspace.id,
      settings: body.settings ?? {}
    });

  await supabaseAdmin
    .from("workspace_activity")
    .insert({
      workspace_id: workspace.id,
      activity_type: "workspace_created",
      entity_type: "workspace",
      entity_id: workspace.id,
      message: "Workspace created",
      performed_by: body.performed_by ?? "system"
    });

  return NextResponse.json({ ok: true, workspace });
}
