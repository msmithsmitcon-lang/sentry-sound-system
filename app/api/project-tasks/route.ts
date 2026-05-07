import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const workspaceId = url.searchParams.get("workspace_id");
  const projectId = url.searchParams.get("project_id");

  let query = supabaseAdmin
    .from("project_tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (workspaceId) {
    query = query.eq("workspace_id", workspaceId);
  }

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    tasks: data
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("project_tasks")
    .insert({
      workspace_id: body.workspace_id,
      project_id: body.project_id,
      title: body.title,
      description: body.description ?? null,
      task_type: body.task_type ?? "general",
      status: body.status ?? "todo",
      priority: body.priority ?? "medium",
      assigned_to: body.assigned_to ?? null,
      due_date: body.due_date ?? null,
      created_by: body.created_by ?? null,
      metadata: body.metadata ?? {}
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  await supabaseAdmin
    .from("workspace_activity")
    .insert({
      workspace_id: body.workspace_id,
      activity_type: "task_created",
      entity_type: "project_task",
      entity_id: data.id,
      message: `Created task ${data.title}`,
      performed_by: body.created_by ?? "system"
    });

  return NextResponse.json({
    ok: true,
    task: data
  });
}
