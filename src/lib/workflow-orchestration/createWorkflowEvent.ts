import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createWorkflowEvent(input: {
  workspaceId: string;

  sourceModule: string;
  eventType: string;

  linkedRecordType?: string | null;
  linkedRecordId?: string | null;

  eventPayload?: Record<string, unknown>;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.sourceModule?.trim()) throw new Error("sourceModule is required");
  if (!input.eventType?.trim()) throw new Error("eventType is required");

  const { data, error } = await supabaseAdmin
    .from("workflow_events")
    .insert({
      workspace_id: input.workspaceId,

      source_module: input.sourceModule.trim(),
      event_type: input.eventType.trim(),

      linked_record_type: input.linkedRecordType ?? null,
      linked_record_id: input.linkedRecordId ?? null,

      event_payload: input.eventPayload ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}
