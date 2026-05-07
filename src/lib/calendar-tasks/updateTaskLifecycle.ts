import { supabaseAdmin } from "@/lib/supabase/admin";

export const TASK_LIFECYCLE_STATUSES = [
  "draft",
  "open",
  "in_progress",
  "blocked",
  "completed",
  "archived",
] as const;

export type TaskLifecycleStatus =
  typeof TASK_LIFECYCLE_STATUSES[number];

export async function updateTaskLifecycle(input: {
  workspaceId: string;
  taskItemId: string;
  lifecycleStatus: TaskLifecycleStatus;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.taskItemId) throw new Error("taskItemId is required");

  if (!TASK_LIFECYCLE_STATUSES.includes(input.lifecycleStatus)) {
    throw new Error("Invalid task lifecycle status");
  }

  const { data, error } = await supabaseAdmin
    .from("task_items")
    .update({ lifecycle_status: input.lifecycleStatus })
    .eq("id", input.taskItemId)
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin.from("task_audit_events").insert({
    workspace_id: input.workspaceId,
    task_item_id: input.taskItemId,
    event_type: "task.lifecycle.updated",
    event_summary: `Task lifecycle updated to ${input.lifecycleStatus}`,
    event_payload: { lifecycleStatus: input.lifecycleStatus },
  });

  return data;
}
