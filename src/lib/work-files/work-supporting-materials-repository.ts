import { randomUUID } from "crypto"

import { prisma } from "@/lib/db/prisma"

import type {
  CreateWorkSupportingMaterialPayload,
  WorkSupportingMaterial,
} from "./work-supporting-materials.types"

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

export async function getWorkSupportingMaterialRows(
  workId: string,
  workspaceId: string
): Promise<WorkSupportingMaterial[]> {
  return prisma.$queryRaw<WorkSupportingMaterial[]>`
    SELECT
      fvi.id,
      fvl.id AS link_id,
      fvi.file_name,
      fvi.file_category,
      COALESCE(fvi.metadata ->> 'referenceStatus', 'reference_only') AS reference_status,
      fvi.metadata ->> 'referenceText' AS reference_text,
      fvi.metadata ->> 'notes' AS notes,
      fvi.metadata ->> 'purpose' AS purpose,
      fvi.metadata ->> 'referenceType' AS "referenceType",
      fvi.metadata ->> 'visibility' AS visibility,
      fvi.metadata ->> 'usageContext' AS "usageContext",
      COALESCE(fvi.metadata ->> 'publicSafeStatus', 'private_only') AS "publicSafeStatus",
      CASE
        WHEN lower(COALESCE(fvi.metadata ->> 'evidenceCandidate', 'false')) = 'true'
          THEN true
        ELSE false
      END AS "evidenceCandidate",
      COALESCE(fvi.metadata ->> 'verificationStatus', 'not_verified') AS "verificationStatus",
      COALESCE(
        fvi.metadata ->> 'lineageSourceType',
        CASE
          WHEN fvi.storage_provider = 'manual_reference' THEN 'manual_reference'
          ELSE 'unknown'
        END
      ) AS "lineageSourceType",
      fvi.file_mime_type,
      fvi.file_size_bytes,
      fvi.created_at
    FROM file_vault_links fvl
    INNER JOIN file_vault_items fvi
      ON fvi.id = fvl.file_vault_item_id
     AND fvi.workspace_id = fvl.workspace_id
    WHERE fvl.workspace_id = ${workspaceId}::uuid
      AND fvl.linked_record_type = 'musical_work'
      AND fvl.linked_record_id = ${workId}::uuid
    ORDER BY fvi.created_at DESC, fvi.file_name ASC
  `
}

export async function createWorkSupportingMaterialReference(input: {
  workId: string
  workspaceId: string
  createdByUserId: string
  payload: CreateWorkSupportingMaterialPayload
}): Promise<WorkSupportingMaterial> {
  const referenceId = randomUUID()
  const storagePath = `manual-reference:${referenceId}`

  const rows = await prisma.$queryRaw<Array<{
    id: string
    link_id: string
    file_name: string
    file_category: WorkSupportingMaterial["file_category"]
    reference_status: WorkSupportingMaterial["reference_status"]
    reference_text: string | null
    notes: string | null
    purpose: WorkSupportingMaterial["purpose"]
    referenceType: WorkSupportingMaterial["referenceType"]
    visibility: WorkSupportingMaterial["visibility"]
    usageContext: WorkSupportingMaterial["usageContext"]
    publicSafeStatus: WorkSupportingMaterial["publicSafeStatus"]
    evidenceCandidate: WorkSupportingMaterial["evidenceCandidate"]
    verificationStatus: WorkSupportingMaterial["verificationStatus"]
    lineageSourceType: WorkSupportingMaterial["lineageSourceType"]
    file_mime_type: string | null
    file_size_bytes: number | null
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
        ${input.payload.fileCategory},
        ${input.payload.fileName},
        NULL,
        NULL,
        'manual_reference',
        NULL,
        ${storagePath},
        NULL,
        jsonb_build_object(
          'referenceStatus', 'reference_only',
          'verificationStatus', 'not_verified',
          'referenceText', ${input.payload.referenceText}::text,
          'notes', ${input.payload.notes}::text,
          'purpose', ${input.payload.purpose}::text,
          'referenceType', ${input.payload.referenceType}::text,
          'visibility', ${input.payload.visibility}::text,
          'usageContext', ${input.payload.usageContext}::text,
          'publicSafeStatus', ${input.payload.publicSafeStatus}::text,
          'evidenceCandidate', ${input.payload.evidenceCandidate}::boolean,
          'sourceModule', 'works',
          'linkedRecordType', 'musical_work',
          'linkedRecordId', ${input.workId}::text,
          'createdByUserId', ${input.createdByUserId}::text,
          'realFileUpload', false,
          'productionEvidenceGovernance', false
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
        'supporting_material',
        jsonb_build_object(
          'sourceModule', 'works',
          'referenceOnly', true,
          'notVerified', true
        )
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
        'work.supporting_material.reference_created',
        'Supporting material reference added to work.',
        jsonb_build_object(
          'workId', ${input.workId}::text,
          'createdByUserId', ${input.createdByUserId}::text,
          'referenceOnly', true,
          'notVerified', true,
          'purpose', ${input.payload.purpose}::text,
          'referenceType', ${input.payload.referenceType}::text,
          'visibility', ${input.payload.visibility}::text,
          'usageContext', ${input.payload.usageContext}::text,
          'publicSafeStatus', ${input.payload.publicSafeStatus}::text,
          'evidenceCandidate', ${input.payload.evidenceCandidate}::boolean
        )
      FROM inserted_file
      RETURNING id
    )
    SELECT
      inserted_file.id,
      inserted_link.id AS link_id,
      inserted_file.file_name,
      inserted_file.file_category,
      COALESCE(inserted_file.metadata ->> 'referenceStatus', 'reference_only') AS reference_status,
      inserted_file.metadata ->> 'referenceText' AS reference_text,
      inserted_file.metadata ->> 'notes' AS notes,
      inserted_file.metadata ->> 'purpose' AS purpose,
      inserted_file.metadata ->> 'referenceType' AS "referenceType",
      inserted_file.metadata ->> 'visibility' AS visibility,
      inserted_file.metadata ->> 'usageContext' AS "usageContext",
      COALESCE(inserted_file.metadata ->> 'publicSafeStatus', 'private_only') AS "publicSafeStatus",
      CASE
        WHEN lower(COALESCE(inserted_file.metadata ->> 'evidenceCandidate', 'false')) = 'true'
          THEN true
        ELSE false
      END AS "evidenceCandidate",
      COALESCE(inserted_file.metadata ->> 'verificationStatus', 'not_verified') AS "verificationStatus",
      COALESCE(
        inserted_file.metadata ->> 'lineageSourceType',
        CASE
          WHEN inserted_file.storage_provider = 'manual_reference' THEN 'manual_reference'
          ELSE 'unknown'
        END
      ) AS "lineageSourceType",
      inserted_file.file_mime_type,
      inserted_file.file_size_bytes,
      inserted_file.created_at
    FROM inserted_file
    INNER JOIN inserted_link ON inserted_link.file_vault_item_id = inserted_file.id
  `

  const created = rows[0]
  if (!created) throw new Error("Failed to create supporting material reference.")

  return {
    ...created,
    created_at:
      created.created_at instanceof Date
        ? created.created_at.toISOString()
        : created.created_at,
  }
}
