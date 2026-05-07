import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createRightsAsset(input: {
  workspaceId: string;
  assetType: "musical_work" | "sound_recording" | "release" | "video" | "brand" | "contract";
  assetReferenceId?: string | null;
  title: string;
  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.assetType) throw new Error("assetType is required");
  if (!input.title?.trim()) throw new Error("title is required");

  const { data, error } = await supabaseAdmin
    .from("rights_assets")
    .insert({
      workspace_id: input.workspaceId,
      asset_type: input.assetType,
      asset_reference_id: input.assetReferenceId ?? null,
      title: input.title.trim(),
      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin.from("rights_audit_events").insert({
    workspace_id: input.workspaceId,
    rights_asset_id: data.id,
    event_type: "rights.asset.created",
    event_summary: `Rights asset created: ${data.title}`,
    event_payload: { rightsAsset: data },
  });

  return data;
}
