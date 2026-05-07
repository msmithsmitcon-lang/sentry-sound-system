import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createCalendarEvent(input: {
  workspaceId: string;

  eventType: string;

  title: string;
  description?: string | null;

  startAt?: string | null;
  endAt?: string | null;

  linkedRecordType?: string | null;
  linkedRecordId?: string | null;

  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) {
    throw new Error("workspaceId is required");
  }

  if (!input.eventType?.trim()) {
    throw new Error("eventType is required");
  }

  if (!input.title?.trim()) {
    throw new Error("title is required");
  }

  const { data, error } = await supabaseAdmin
    .from("calendar_events")
    .insert({
      workspace_id: input.workspaceId,

      event_type: input.eventType.trim(),

      title: input.title.trim(),
      description: input.description ?? null,

      start_at: input.startAt ?? null,
      end_at: input.endAt ?? null,

      linked_record_type:
        input.linkedRecordType ?? null,

      linked_record_id:
        input.linkedRecordId ?? null,

      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}
