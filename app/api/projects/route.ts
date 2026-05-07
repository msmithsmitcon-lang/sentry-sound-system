import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const workspaceId =
    url.searchParams.get("workspace_id");

  let query = supabaseAdmin
    .from("projects")
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
    projects: data
  });
}

export async function POST(req: Request) {

  const body = await req.json();

  const { data, error } =
    await supabaseAdmin
      .from("projects")
      .insert({
        workspace_id:
          body.workspace_id,

        party_id:
          body.workspace_id,

        title:
          body.title,

        project_name:
          body.title,

        description:
          body.description ?? null,

        project_type:
          body.project_type ??
          "music_project",

        status:
          body.status ??
          "planning",

        start_date:
          body.start_date ?? null,

        end_date:
          body.end_date ?? null,

        created_by:
          body.created_by ?? null,

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

  try {

    await supabaseAdmin
      .from("workspace_activity")
      .insert({
        workspace_id:
          body.workspace_id,

        activity_type:
          "project_created",

        entity_type:
          "project",

        entity_id:
          data.id,

        message:
          `Created project ${data.title}`,

        performed_by:
          body.created_by ?? "system"
      });

  } catch {}

  return NextResponse.json({
    ok: true,
    project: data
  });
}
