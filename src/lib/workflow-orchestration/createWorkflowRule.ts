import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createWorkflowRule(input: {
  workspaceId: string;

  ruleName: string;

  sourceModule?: string | null;
  eventType?: string | null;

  active?: boolean;

  conditions?: Record<string, unknown>;
  actions?: Record<string, unknown>[];
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.ruleName?.trim()) throw new Error("ruleName is required");

  const { data, error } = await supabaseAdmin
    .from("workflow_rules")
    .insert({
      workspace_id: input.workspaceId,
      rule_name: input.ruleName.trim(),
      source_module: input.sourceModule ?? null,
      event_type: input.eventType ?? null,
      active: input.active ?? true,
      conditions: input.conditions ?? {},
      actions: input.actions ?? [],
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}
