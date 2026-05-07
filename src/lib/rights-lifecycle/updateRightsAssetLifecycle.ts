import { supabaseAdmin } from "@/lib/supabase/admin";

export const RIGHTS_LIFECYCLE_STATUSES = [
  "draft",
  "claimed",
  "verified",
  "active",
  "disputed",
  "expired",
  "archived",
] as const;

export type RightsLifecycleStatus =
  typeof RIGHTS_LIFECYCLE_STATUSES[number];

export async function updateRightsAssetLifecycle(input: {
  workspaceId: string;
  rightsAssetId: string;
  lifecycleStatus: RightsLifecycleStatus;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.rightsAssetId) throw new Error("rightsAssetId is required");

  if (!RIGHTS_LIFECYCLE_STATUSES.includes(input.lifecycleStatus)) {
    throw new Error("Invalid rights lifecycle status");
  }

  const { data, error } = await supabaseAdmin
    .from("rights_assets")
    .update({
      lifecycle_status: input.lifecycleStatus,
    })
    .eq("id", input.rightsAssetId)
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin.from("rights_lifecycle_events").insert({
    workspace_id: input.workspaceId,
    rights_asset_id: input.rightsAssetId,
    event_type: "rights.lifecycle.updated",
    event_summary: `Rights lifecycle updated to ${input.lifecycleStatus}`,
    event_payload: { lifecycleStatus: input.lifecycleStatus },
  });

  return data;
}
