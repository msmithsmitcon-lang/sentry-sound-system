import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createWorkflowRun(input: {
  workspaceId: string;
  workflowEventId?: string | null;
  workflowRuleId?: string | null;
  runPayload?: Record<string, unknown>;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");

  const { data, error } = await supabaseAdmin
    .from("workflow_runs")
    .insert({
      workspace_id: input.workspaceId,
      workflow_event_id: input.workflowEventId ?? null,
      workflow_rule_id: input.workflowRuleId ?? null,
      run_payload: input.runPayload ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}
