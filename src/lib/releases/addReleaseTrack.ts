import { supabaseAdmin } from "@/lib/supabase/admin";

export async function addReleaseTrack(input: {
  workspaceId: string;

  releaseId: string;

  trackNumber: number;

  title: string;

  musicalWorkId?: string | null;
  soundRecordingId?: string | null;

  isrc?: string | null;

  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) {
    throw new Error("workspaceId is required");
  }

  if (!input.releaseId) {
    throw new Error("releaseId is required");
  }

  if (!input.trackNumber) {
    throw new Error("trackNumber is required");
  }

  if (!input.title?.trim()) {
    throw new Error("title is required");
  }

  const { data, error } = await supabaseAdmin
    .from("release_tracks")
    .insert({
      workspace_id: input.workspaceId,

      release_id: input.releaseId,

      track_number: input.trackNumber,

      title: input.title.trim(),

      musical_work_id:
        input.musicalWorkId ?? null,

      sound_recording_id:
        input.soundRecordingId ?? null,

      isrc: input.isrc ?? null,

      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin
    .from("release_audit_events")
    .insert({
      workspace_id: input.workspaceId,
      release_id: input.releaseId,
      event_type: "release.track.added",
      event_summary: `Track added: ${input.title}`,
      event_payload: {
        releaseTrack: data,
      },
    });

  return data;
}
