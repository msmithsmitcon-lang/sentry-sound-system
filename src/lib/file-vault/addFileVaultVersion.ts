import { supabaseAdmin } from "@/lib/supabase/admin";

export async function addFileVaultVersion(input: {
  workspaceId: string;
  fileVaultItemId: string;
  versionNumber: number;
  storagePath: string;
  checksum?: string | null;
  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.fileVaultItemId) throw new Error("fileVaultItemId is required");
  if (!input.versionNumber) throw new Error("versionNumber is required");
  if (!input.storagePath?.trim()) throw new Error("storagePath is required");

  const { data, error } = await supabaseAdmin
    .from("file_vault_versions")
    .insert({
      workspace_id: input.workspaceId,
      file_vault_item_id: input.fileVaultItemId,
      version_number: input.versionNumber,
      storage_path: input.storagePath.trim(),
      checksum: input.checksum ?? null,
      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin.from("file_vault_audit_events").insert({
    workspace_id: input.workspaceId,
    file_vault_item_id: input.fileVaultItemId,
    event_type: "file.version.added",
    event_summary: `File version added: v${input.versionNumber}`,
    event_payload: { fileVaultVersion: data },
  });

  return data;
}
