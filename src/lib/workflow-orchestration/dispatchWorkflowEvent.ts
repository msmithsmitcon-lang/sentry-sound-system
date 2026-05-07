import { supabaseAdmin } from "@/lib/supabase/admin";
import { createWorkflowRun } from "./createWorkflowRun";

export async function dispatchWorkflowEvent(input: {
  workspaceId: string;
  workflowEventId: string;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.workflowEventId) throw new Error("workflowEventId is required");

  const { data: event, error: eventError } = await supabaseAdmin
    .from("workflow_events")
    .select("*")
    .eq("id", input.workflowEventId)
    .eq("workspace_id", input.workspaceId)
    .single();

  if (eventError) throw eventError;

  const { data: rules, error: rulesError } = await supabaseAdmin
    .from("workflow_rules")
    .select("*")
    .eq("workspace_id", input.workspaceId)
    .eq("active", true)
    .or(`source_module.is.null,source_module.eq.${event.source_module}`)
    .or(`event_type.is.null,event_type.eq.${event.event_type}`);

  if (rulesError) throw rulesError;

  const runs = [];

  for (const rule of rules ?? []) {
    const run = await createWorkflowRun({
      workspaceId: input.workspaceId,
      workflowEventId: event.id,
      workflowRuleId: rule.id,
      runPayload: {
        event,
        rule,
      },
    });

    runs.push(run);
  }

  await supabaseAdmin
    .from("workflow_events")
    .update({ processed: true })
    .eq("id", event.id);

  return {
    event,
    matchedRules: rules ?? [],
    createdRuns: runs,
  };
}
