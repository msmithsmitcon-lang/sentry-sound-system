import { supabaseAdmin } from "@/lib/supabase/admin";

export const RELEASE_LIFECYCLE_STATUSES = [
  "draft",
  "metadata_review",
  "ready",
  "scheduled",
  "released",
  "takedown_requested",
  "archived",
] as const;

export type ReleaseLifecycleStatus =
  typeof RELEASE_LIFECYCLE_STATUSES[number];

export async function updateReleaseLifecycle(input: {
  workspaceId: string;
  releaseId: string;
  lifecycleStatus: ReleaseLifecycleStatus;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.releaseId) throw new Error("releaseId is required");

  if (!RELEASE_LIFECYCLE_STATUSES.includes(input.lifecycleStatus)) {
    throw new Error("Invalid release lifecycle status");
  }

  const { data, error } = await supabaseAdmin
    .from("releases")
    .update({ lifecycle_status: input.lifecycleStatus })
    .eq("id", input.releaseId)
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin.from("release_audit_events").insert({
    workspace_id: input.workspaceId,
    release_id: input.releaseId,
    event_type: "release.lifecycle.updated",
    event_summary: `Release lifecycle updated to ${input.lifecycleStatus}`,
    event_payload: { lifecycleStatus: input.lifecycleStatus },
  });

  return data;
}
