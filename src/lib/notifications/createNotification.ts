import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createNotification(input: {
  workspaceId: string;

  notificationType: string;

  title: string;
  message: string;

  linkedRecordType?: string | null;
  linkedRecordId?: string | null;

  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) {
    throw new Error("workspaceId is required");
  }

  if (!input.notificationType?.trim()) {
    throw new Error("notificationType is required");
  }

  if (!input.title?.trim()) {
    throw new Error("title is required");
  }

  if (!input.message?.trim()) {
    throw new Error("message is required");
  }

  const { data, error } = await supabaseAdmin
    .from("notifications")
    .insert({
      workspace_id: input.workspaceId,

      notification_type:
        input.notificationType.trim(),

      title: input.title.trim(),
      message: input.message.trim(),

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
