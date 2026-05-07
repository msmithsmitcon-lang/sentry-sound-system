import { supabaseAdmin } from "@/lib/supabase/admin";

export async function assignTaskItem(input: {
  workspaceId: string;
  taskItemId: string;

  assignedWorkspaceMemberId?: string | null;
  assignedCrmContactId?: string | null;

  assignmentRole?: string | null;

  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.taskItemId) throw new Error("taskItemId is required");

  const { data, error } = await supabaseAdmin
    .from("task_assignments")
    .insert({
      workspace_id: input.workspaceId,
      task_item_id: input.taskItemId,

      assigned_workspace_member_id:
        input.assignedWorkspaceMemberId ?? null,

      assigned_crm_contact_id:
        input.assignedCrmContactId ?? null,

      assignment_role:
        input.assignmentRole ?? null,

      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin.from("task_audit_events").insert({
    workspace_id: input.workspaceId,
    task_item_id: input.taskItemId,
    event_type: "task.assigned",
    event_summary: "Task assignment created",
    event_payload: { taskAssignment: data },
  });

  return data;
}
