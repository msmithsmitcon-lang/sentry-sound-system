import { supabaseAdmin } from "@/lib/supabaseAdmin"

import { AssetAdminRepository, GovernedAsset } from "./asset-governance"

type FileVaultItemRow = {
  id: string
  workspace_id: string
  file_category: string
  file_name: string
  file_mime_type: string | null
  file_size_bytes: number | null
  storage_path: string
  metadata: Record<string, unknown>
  created_at: string
}

export const assetAdminSupabaseRepository: AssetAdminRepository = {
  async listAssets(input) {
    const { data, error } = await supabaseAdmin
      .from("file_vault_items")
      .select(
        "id,workspace_id,file_category,file_name,file_mime_type,file_size_bytes,storage_path,metadata,created_at"
      )
      .eq("workspace_id", input.workspaceId)
      .contains("metadata", { routeMode: "TEST_INTERNAL_ADMIN_ONLY" })
      .order("created_at", { ascending: false })
      .limit(input.limit)

    if (error) throw new Error(error.message)

    return (data ?? []).map(mapFileVaultItemRowToAsset)
  },

  async createAsset(asset) {
    const { data, error } = await supabaseAdmin
      .from("file_vault_items")
      .insert({
        workspace_id: asset.workspaceId,
        file_category: mapAssetCategoryToFileVaultCategory(asset.assetCategory),
        file_name: asset.fileName,
        file_mime_type: asset.mimeType,
        file_size_bytes: asset.fileSizeBytes,
        storage_provider: "supabase",
        storage_bucket: null,
        storage_path: asset.storagePath,
        checksum: null,
        metadata: {
          ...asset.metadata,
          assetEvent: asset,
          operationalAuditEvent: asset.auditEvent,
          lifecycleEvent: asset.lifecycleEvent,
          linkedEntityType: asset.linkedEntityType,
          linkedEntityId: asset.linkedEntityId,
          routeMode: "TEST_INTERNAL_ADMIN_ONLY",
          productionActivation: false,
          realFileUpload: false,
          persistenceTable: "file_vault_items",
        },
      })
      .select(
        "id,workspace_id,file_category,file_name,file_mime_type,file_size_bytes,storage_path,metadata,created_at"
      )
      .single()

    if (error) throw new Error(error.message)

    await supabaseAdmin.from("file_vault_audit_events").insert({
      workspace_id: asset.workspaceId,
      file_vault_item_id: data.id,
      event_type: "test.asset.governance.created",
      event_summary: `TEST asset governance event created: ${asset.title}`,
      event_payload: {
        assetEvent: asset,
        productionActivation: false,
      },
    })

    return mapFileVaultItemRowToAsset(data)
  },
}

function mapFileVaultItemRowToAsset(row: FileVaultItemRow): GovernedAsset {
  const persistedAsset = row.metadata?.assetEvent

  if (persistedAsset && typeof persistedAsset === "object") {
    return {
      ...(persistedAsset as GovernedAsset),
      assetId: row.id,
      createdAt: row.created_at,
    }
  }

  return {
    assetId: row.id,
    workspaceId: row.workspace_id,
    assetType: "other",
    assetCategory: "file_vault",
    title: row.file_name,
    fileName: row.file_name,
    mimeType: row.file_mime_type,
    fileSizeBytes: row.file_size_bytes,
    storagePath: row.storage_path,
    status: "uploaded",
    linkedEntityType: "none",
    linkedEntityId: null,
    tags: [],
    metadata: row.metadata ?? {},
    auditEvent: row.metadata?.operationalAuditEvent as Record<string, unknown>,
    lifecycleEvent: row.metadata?.lifecycleEvent as Record<string, unknown>,
    createdBy: null,
    createdAt: row.created_at,
    mode: "TEST_INTERNAL_ADMIN_ONLY",
    productionActivation: false,
  }
}

function mapAssetCategoryToFileVaultCategory(category: GovernedAsset["assetCategory"]) {
  switch (category) {
    case "artwork":
      return "artwork"
    case "evidence_file":
      return "proof_of_ownership"
    case "submission_package":
      return "compliance"
    case "song_file":
      return "master_audio"
    default:
      return "other"
  }
}
