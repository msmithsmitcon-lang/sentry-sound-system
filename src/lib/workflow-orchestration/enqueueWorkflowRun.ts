import { supabaseAdmin } from "@/lib/supabase/admin";

export async function enqueueWorkflowRun(input: {
  workspaceId: string;
  workflowRunId: string;

  priorityLevel?:
    | "low"
    | "normal"
    | "high"
    | "critical";

  availableAt?: string | null;
}) {
  if (!input.workspaceId) {
    throw new Error("workspaceId is required");
  }

  if (!input.workflowRunId) {
    throw new Error("workflowRunId is required");
  }

  const { data, error } = await supabaseAdmin
    .from("workflow_queue")
    .insert({
      workspace_id: input.workspaceId,

      workflow_run_id: input.workflowRunId,

      priority_level:
        input.priorityLevel ?? "normal",

      available_at:
        input.availableAt ?? new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}
