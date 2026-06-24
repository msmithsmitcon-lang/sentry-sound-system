import { prisma } from "@/lib/db/prisma"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

import type { WorkAssetCategory, WorkAssetRecord } from "./work-asset-upload.types"

export const WORK_ASSETS_STORAGE_BUCKET = "work-assets"

export async function canonicalWorkExistsForWorkspace(
  workId: string,
  workspaceId: string
): Promise<boolean> {
  const rows = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT id
    FROM musical_works
    WHERE id = ${workId}::uuid
      AND workspace_id = ${workspaceId}::uuid
    LIMIT 1
  `

  return rows.length > 0
}

export async function uploadWorkAssetToStorage(input: {
  workspaceId: string
  workId: string
  fileName: string
  mimeType: string | null
  bytes: Buffer
}): Promise<{ storagePath: string }> {
  const storagePath = `${input.workspaceId}/${input.workId}/${Date.now()}-${sanitizeFileName(input.fileName)}`

  const { error } = await supabaseAdmin.storage
    .from(WORK_ASSETS_STORAGE_BUCKET)
    .upload(storagePath, input.bytes, {
      contentType: input.mimeType ?? undefined,
      upsert: false,
    })

  if (error) {
    throw new Error(`Failed to upload file to storage: ${error.message}`)
  }

  return { storagePath }
}

export async function createWorkAssetRecord(input: {
  workId: string
  workspaceId: string
  createdByUserId: string
  fileName: string
  fileCategory: WorkAssetCategory
  mimeType: string | null
  sizeBytes: number
  storagePath: string
  checksum: string
}): Promise<WorkAssetRecord> {
  const rows = await prisma.$queryRaw<Array<{
    id: string
    link_id: string
    file_name: string
    file_category: WorkAssetCategory
    file_mime_type: string | null
    file_size_bytes: number | null
    storage_bucket: string | null
    storage_path: string
    checksum: string | null
    created_at: Date | string
  }>>`
    WITH inserted_file AS (
      INSERT INTO file_vault_items (
        workspace_id,
        file_category,
        file_name,
        file_mime_type,
        file_size_bytes,
        storage_provider,
        storage_bucket,
        storage_path,
        checksum,
        metadata
      )
      VALUES (
        ${input.workspaceId}::uuid,
        ${input.fileCategory},
        ${input.fileName},
        ${input.mimeType},
        ${input.sizeBytes},
        'supabase',
        ${WORK_ASSETS_STORAGE_BUCKET},
        ${input.storagePath},
        ${input.checksum},
        jsonb_build_object(
          'sourceModule', 'works',
          'linkedRecordType', 'musical_work',
          'linkedRecordId', ${input.workId}::text,
          'createdByUserId', ${input.createdByUserId}::text,
          'realFileUpload', true
        )
      )
      RETURNING *
    ),
    inserted_link AS (
      INSERT INTO file_vault_links (
        workspace_id,
        file_vault_item_id,
        linked_record_type,
        linked_record_id,
        link_role,
        metadata
      )
      SELECT
        ${input.workspaceId}::uuid,
        inserted_file.id,
        'musical_work',
        ${input.workId}::uuid,
        'work_asset',
        jsonb_build_object('sourceModule', 'works', 'realFileUpload', true)
      FROM inserted_file
      RETURNING *
    ),
    inserted_audit AS (
      INSERT INTO file_vault_audit_events (
        workspace_id,
        file_vault_item_id,
        event_type,
        event_summary,
        event_payload
      )
      SELECT
        ${input.workspaceId}::uuid,
        inserted_file.id,
        'work.asset.uploaded',
        'Audio/asset file uploaded to work.',
        jsonb_build_object(
          'workId', ${input.workId}::text,
          'createdByUserId', ${input.createdByUserId}::text,
          'checksum', ${input.checksum}::text
        )
      FROM inserted_file
      RETURNING id
    )
    SELECT
      inserted_file.id,
      inserted_link.id AS link_id,
      inserted_file.file_name,
      inserted_file.file_category,
      inserted_file.file_mime_type,
      inserted_file.file_size_bytes,
      inserted_file.storage_bucket,
      inserted_file.storage_path,
      inserted_file.checksum,
      inserted_file.created_at
    FROM inserted_file
    INNER JOIN inserted_link ON inserted_link.file_vault_item_id = inserted_file.id
  `

  const created = rows[0]
  if (!created) throw new Error("Failed to create work asset record.")

  return {
    ...created,
    created_at:
      created.created_at instanceof Date
        ? created.created_at.toISOString()
        : created.created_at,
  }
}

export async function getWorkAssetRows(
  workId: string,
  workspaceId: string
): Promise<WorkAssetRecord[]> {
  const rows = await prisma.$queryRaw<Array<{
    id: string
    link_id: string
    file_name: string
    file_category: WorkAssetCategory
    file_mime_type: string | null
    file_size_bytes: number | null
    storage_bucket: string | null
    storage_path: string
    checksum: string | null
    created_at: Date | string
  }>>`
    SELECT
      fvi.id,
      fvl.id AS link_id,
      fvi.file_name,
      fvi.file_category,
      fvi.file_mime_type,
      fvi.file_size_bytes,
      fvi.storage_bucket,
      fvi.storage_path,
      fvi.checksum,
      fvi.created_at
    FROM file_vault_links fvl
    INNER JOIN file_vault_items fvi
      ON fvi.id = fvl.file_vault_item_id
     AND fvi.workspace_id = fvl.workspace_id
    WHERE fvl.workspace_id = ${workspaceId}::uuid
      AND fvl.linked_record_type = 'musical_work'
      AND fvl.linked_record_id = ${workId}::uuid
      AND fvl.link_role = 'work_asset'
    ORDER BY fvi.created_at DESC
  `

  return rows.map((row) => ({
    ...row,
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
  }))
}

/**
 * Retrieves the most recent uploaded audio master for a work, including
 * its checksum — used by the proof-of-collaboration certificate service
 * (Phase 4), which requires a real audio file hash, not a placeholder.
 */
export async function getLatestMasterAudioAsset(
  workId: string,
  workspaceId: string
): Promise<WorkAssetRecord | null> {
  const rows = await prisma.$queryRaw<Array<{
    id: string
    link_id: string
    file_name: string
    file_category: WorkAssetCategory
    file_mime_type: string | null
    file_size_bytes: number | null
    storage_bucket: string | null
    storage_path: string
    checksum: string | null
    created_at: Date | string
  }>>`
    SELECT
      fvi.id,
      fvl.id AS link_id,
      fvi.file_name,
      fvi.file_category,
      fvi.file_mime_type,
      fvi.file_size_bytes,
      fvi.storage_bucket,
      fvi.storage_path,
      fvi.checksum,
      fvi.created_at
    FROM file_vault_links fvl
    INNER JOIN file_vault_items fvi
      ON fvi.id = fvl.file_vault_item_id
     AND fvi.workspace_id = fvl.workspace_id
    WHERE fvl.workspace_id = ${workspaceId}::uuid
      AND fvl.linked_record_type = 'musical_work'
      AND fvl.linked_record_id = ${workId}::uuid
      AND fvl.link_role = 'work_asset'
      AND fvi.file_category = 'master_audio'
      AND fvi.checksum IS NOT NULL
    ORDER BY fvi.created_at DESC
    LIMIT 1
  `

  const row = rows[0]
  if (!row) return null

  return {
    ...row,
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
  }
}

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_")
}
