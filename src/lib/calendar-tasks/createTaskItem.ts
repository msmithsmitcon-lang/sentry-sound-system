import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createTaskItem(input: {
  workspaceId: string;

  taskType: string;

  title: string;
  description?: string | null;

  priorityLevel?: "low" | "normal" | "high" | "critical";

  dueAt?: string | null;

  linkedRecordType?: string | null;
  linkedRecordId?: string | null;

  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.taskType?.trim()) throw new Error("taskType is required");
  if (!input.title?.trim()) throw new Error("title is required");

  const { data, error } = await supabaseAdmin
    .from("task_items")
    .insert({
      workspace_id: input.workspaceId,

      task_type: input.taskType.trim(),

      title: input.title.trim(),
      description: input.description ?? null,

      priority_level: input.priorityLevel ?? "normal",

      due_at: input.dueAt ?? null,

      linked_record_type: input.linkedRecordType ?? null,
      linked_record_id: input.linkedRecordId ?? null,

      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin.from("task_audit_events").insert({
    workspace_id: input.workspaceId,
    task_item_id: data.id,
    event_type: "task.created",
    event_summary: `Task created: ${data.title}`,
    event_payload: { taskItem: data },
  });

  return data;
}
