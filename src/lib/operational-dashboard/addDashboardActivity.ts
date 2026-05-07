import { supabaseAdmin } from "@/lib/supabase/admin";

export async function addDashboardActivity(input: {
  workspaceId: string;

  activityType: string;
  activitySummary: string;

  linkedRecordType?: string | null;
  linkedRecordId?: string | null;

  activityPayload?: Record<string, unknown>;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.activityType?.trim()) throw new Error("activityType is required");
  if (!input.activitySummary?.trim()) throw new Error("activitySummary is required");

  const { data, error } = await supabaseAdmin
    .from("dashboard_activity_feed")
    .insert({
      workspace_id: input.workspaceId,

      activity_type: input.activityType.trim(),
      activity_summary: input.activitySummary.trim(),

      linked_record_type: input.linkedRecordType ?? null,
      linked_record_id: input.linkedRecordId ?? null,

      activity_payload: input.activityPayload ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}
