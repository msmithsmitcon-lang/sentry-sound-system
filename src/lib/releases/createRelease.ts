import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createRelease(input: {
  workspaceId: string;

  releaseType:
    | "single"
    | "ep"
    | "album"
    | "compilation"
    | "deluxe"
    | "live"
    | "remix";

  title: string;

  primaryArtistProfileId?: string | null;

  catalogNumber?: string | null;
  upc?: string | null;

  externalReleaseReference?: string | null;
  distributorReference?: string | null;

  plannedReleaseDate?: string | null;

  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) {
    throw new Error("workspaceId is required");
  }

  if (!input.releaseType) {
    throw new Error("releaseType is required");
  }

  if (!input.title?.trim()) {
    throw new Error("title is required");
  }

  const { data, error } = await supabaseAdmin
    .from("releases")
    .insert({
      workspace_id: input.workspaceId,

      release_type: input.releaseType,

      title: input.title.trim(),

      primary_artist_profile_id:
        input.primaryArtistProfileId ?? null,

      catalog_number:
        input.catalogNumber ?? null,

      upc: input.upc ?? null,

      external_release_reference:
        input.externalReleaseReference ?? null,

      distributor_reference:
        input.distributorReference ?? null,

      planned_release_date:
        input.plannedReleaseDate ?? null,

      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin
    .from("release_audit_events")
    .insert({
      workspace_id: input.workspaceId,
      release_id: data.id,
      event_type: "release.created",
      event_summary: `Release created: ${data.title}`,
      event_payload: {
        release: data,
      },
    });

  return data;
}
