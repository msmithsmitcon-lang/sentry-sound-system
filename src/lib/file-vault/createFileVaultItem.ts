import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createFileVaultItem(input: {
  workspaceId: string;
  fileCategory:
    | "contract"
    | "identity_kyc"
    | "proof_of_ownership"
    | "split_sheet"
    | "master_audio"
    | "artwork"
    | "release_document"
    | "compliance"
    | "invoice"
    | "statement"
    | "other";
  fileName: string;
  storagePath: string;
  fileMimeType?: string | null;
  fileSizeBytes?: number | null;
  storageProvider?: string;
  storageBucket?: string | null;
  checksum?: string | null;
  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.fileCategory) throw new Error("fileCategory is required");
  if (!input.fileName?.trim()) throw new Error("fileName is required");
  if (!input.storagePath?.trim()) throw new Error("storagePath is required");

  const { data, error } = await supabaseAdmin
    .from("file_vault_items")
    .insert({
      workspace_id: input.workspaceId,
      file_category: input.fileCategory,
      file_name: input.fileName.trim(),
      file_mime_type: input.fileMimeType ?? null,
      file_size_bytes: input.fileSizeBytes ?? null,
      storage_provider: input.storageProvider ?? "supabase",
      storage_bucket: input.storageBucket ?? null,
      storage_path: input.storagePath.trim(),
      checksum: input.checksum ?? null,
      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin.from("file_vault_audit_events").insert({
    workspace_id: input.workspaceId,
    file_vault_item_id: data.id,
    event_type: "file.created",
    event_summary: `File vault item created: ${data.file_name}`,
    event_payload: { fileVaultItem: data },
  });

  return data;
}
