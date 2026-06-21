import { buildOperationalAuditEvent } from "@/lib/audit/operational-audit-event-builder"
import { buildLifecycleEvent } from "@/lib/workflow/lifecycle-event-builder"

import {
  ASSET_GOVERNANCE_TEST_MODE,
  AssetBuildErrorCode,
  AssetBuildResult,
  AssetCreateInput,
  isAssetCategory,
  isAssetLinkedEntityType,
  isAssetStatus,
  isAssetType,
  normalizeRequiredString,
} from "./asset-governance"

export function buildAssetEvent(input: AssetCreateInput): AssetBuildResult {
  const workspaceId = normalizeRequiredString(input.workspaceId)
  const title = normalizeRequiredString(input.title)
  const fileName = normalizeRequiredString(input.fileName)
  const storagePath = normalizeRequiredString(input.storagePath)
  const assetType = input.assetType?.trim()
  const assetCategory = input.assetCategory?.trim()
  const status = input.status?.trim()
  const linkedEntityType = input.linkedEntityType?.trim() ?? "none"
  const createdAt = input.createdAt ?? new Date().toISOString()

  if (!workspaceId) return fail("WORKSPACE_ID_REQUIRED", "workspace_id is required.")
  if (!title) return fail("TITLE_REQUIRED", "title is required.")
  if (!fileName) return fail("FILE_NAME_REQUIRED", "file_name is required.")
  if (!storagePath) return fail("STORAGE_PATH_REQUIRED", "storage_path is required.")
  if (!assetType || !isAssetType(assetType)) {
    return fail("INVALID_ASSET_TYPE", "asset_type is not allowed.")
  }
  if (!assetCategory || !isAssetCategory(assetCategory)) {
    return fail("INVALID_ASSET_CATEGORY", "asset_category is not allowed.")
  }
  if (!status || !isAssetStatus(status)) {
    return fail("INVALID_ASSET_STATUS", "status is not allowed.")
  }
  if (!isAssetLinkedEntityType(linkedEntityType)) {
    return fail("INVALID_LINKED_ENTITY_TYPE", "linked_entity_type is not allowed.")
  }
  if (
    input.fileSizeBytes !== null &&
    input.fileSizeBytes !== undefined &&
    (!Number.isFinite(input.fileSizeBytes) || input.fileSizeBytes < 0)
  ) {
    return fail("INVALID_FILE_SIZE", "file_size_bytes must be a positive number.")
  }
  if (Number.isNaN(new Date(createdAt).getTime())) {
    return fail("INVALID_CREATED_AT", "created_at must be a valid date.")
  }

  const assetId = normalizeRequiredString(input.assetId) ?? `asset_${crypto.randomUUID()}`
  const linkedEntityId = normalizeRequiredString(input.linkedEntityId)
  const createdBy = normalizeRequiredString(input.createdBy)
  const lifecycle = buildLifecycleEvent({
    eventId: `asset_lifecycle_${assetId}`,
    workspaceId,
    entityType: "file",
    entityId: assetId,
    currentState: "uploaded",
    nextState: mapAssetStatusToLifecycleState(status),
    transitionKey: `asset.${status}`,
    actorUserId: createdBy,
    reason: "TEST asset governance event",
    metadata: {
      assetType,
      assetCategory,
      linkedEntityType,
      linkedEntityId,
      productionActivation: false,
    },
    occurredAt: createdAt,
  })

  if (!lifecycle.ok) {
    return fail("INVALID_ASSET_STATUS", lifecycle.error.message)
  }

  const audit = buildOperationalAuditEvent({
    eventId: `asset_audit_${assetId}`,
    workspaceId,
    actorUserId: createdBy,
    action: `asset.${status}`,
    resourceType: "file",
    resourceId: assetId,
    resourceLabel: title,
    category: assetCategory === "evidence_file" ? "evidence" : "file",
    severity: status === "rejected" || status === "expired" ? "warning" : "info",
    status: status === "rejected" ? "blocked" : "success",
    metadata: {
      assetType,
      assetCategory,
      linkedEntityType,
      linkedEntityId,
      routeMode: ASSET_GOVERNANCE_TEST_MODE,
      productionActivation: false,
    },
    occurredAt: createdAt,
  })

  if (!audit.ok) {
    return fail("INVALID_ASSET_STATUS", audit.error.message)
  }

  return {
    ok: true,
    asset: {
      assetId,
      workspaceId,
      assetType,
      assetCategory,
      title,
      fileName,
      mimeType: normalizeRequiredString(input.mimeType),
      fileSizeBytes: input.fileSizeBytes ?? null,
      storagePath,
      status,
      linkedEntityType,
      linkedEntityId,
      tags: Array.isArray(input.tags)
        ? input.tags.map((tag) => tag.trim()).filter(Boolean)
        : [],
      metadata: {
        ...(input.metadata ?? {}),
        routeMode: ASSET_GOVERNANCE_TEST_MODE,
        productionActivation: false,
        realFileUpload: false,
      },
      auditEvent: audit.event,
      lifecycleEvent: lifecycle.event,
      createdBy,
      createdAt,
      mode: ASSET_GOVERNANCE_TEST_MODE,
      productionActivation: false,
    },
  }
}

function mapAssetStatusToLifecycleState(status: string) {
  switch (status) {
    case "linked":
      return "linked"
    case "archived":
      return "archived"
    case "expired":
      return "expired"
    default:
      return "linked"
  }
}

function fail(code: AssetBuildErrorCode, message: string): AssetBuildResult {
  return { ok: false, error: { code, message } }
}
