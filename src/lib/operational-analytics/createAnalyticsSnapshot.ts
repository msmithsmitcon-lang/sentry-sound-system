import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createAnalyticsSnapshot(input: {
  workspaceId: string;

  snapshotType: string;
  snapshotData?: Record<string, unknown>;
}) {
  if (!input.workspaceId) {
    throw new Error("workspaceId is required");
  }

  if (!input.snapshotType?.trim()) {
    throw new Error("snapshotType is required");
  }

  const { data, error } = await supabaseAdmin
    .from("analytics_snapshots")
    .insert({
      workspace_id: input.workspaceId,
      snapshot_type: input.snapshotType.trim(),
      snapshot_data: input.snapshotData ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}
