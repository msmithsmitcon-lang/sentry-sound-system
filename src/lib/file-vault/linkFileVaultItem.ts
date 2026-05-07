import { supabaseAdmin } from "@/lib/supabase/admin";

export async function linkFileVaultItem(input: {
  workspaceId: string;
  fileVaultItemId: string;

  linkedRecordType: string;
  linkedRecordId: string;

  linkRole?: string | null;

  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.fileVaultItemId) throw new Error("fileVaultItemId is required");
  if (!input.linkedRecordType?.trim()) throw new Error("linkedRecordType is required");
  if (!input.linkedRecordId) throw new Error("linkedRecordId is required");

  const { data, error } = await supabaseAdmin
    .from("file_vault_links")
    .insert({
      workspace_id: input.workspaceId,
      file_vault_item_id: input.fileVaultItemId,
      linked_record_type: input.linkedRecordType.trim(),
      linked_record_id: input.linkedRecordId,
      link_role: input.linkRole ?? null,
      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin.from("file_vault_audit_events").insert({
    workspace_id: input.workspaceId,
    file_vault_item_id: input.fileVaultItemId,
    event_type: "file.linked",
    event_summary: `File linked to ${input.linkedRecordType}`,
    event_payload: { fileVaultLink: data },
  });

  return data;
}
