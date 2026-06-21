import { LIFECYCLE_TEST_MODE } from "@/lib/workflow/lifecycle-state"

export const ASSET_GOVERNANCE_TEST_MODE = "TEST_INTERNAL_ADMIN_ONLY"

export const assetTypes = [
  "audio",
  "image",
  "document",
  "video",
  "template",
  "evidence",
  "artwork",
  "metadata",
  "other",
] as const

export const assetCategories = [
  "song_file",
  "evidence_file",
  "artwork",
  "file_vault",
  "template",
  "project_asset",
  "submission_package",
] as const

export const assetStatuses = [
  "draft",
  "uploaded",
  "linked",
  "verified",
  "rejected",
  "archived",
  "expired",
] as const

export const assetLinkedEntityTypes = [
  "song",
  "submission",
  "evidence",
  "project",
  "workspace",
  "template",
  "none",
] as const

export type AssetType = (typeof assetTypes)[number]
export type AssetCategory = (typeof assetCategories)[number]
export type AssetStatus = (typeof assetStatuses)[number]
export type AssetLinkedEntityType = (typeof assetLinkedEntityTypes)[number]

export type GovernedAsset = {
  assetId: string
  workspaceId: string
  assetType: AssetType
  assetCategory: AssetCategory
  title: string
  fileName: string
  mimeType: string | null
  fileSizeBytes: number | null
  storagePath: string
  status: AssetStatus
  linkedEntityType: AssetLinkedEntityType
  linkedEntityId: string | null
  tags: string[]
  metadata: Record<string, unknown>
  auditEvent: Record<string, unknown>
  lifecycleEvent: Record<string, unknown>
  createdBy: string | null
  createdAt: string
  mode: typeof ASSET_GOVERNANCE_TEST_MODE
  productionActivation: false
}

export type AssetCreateInput = {
  workspaceId?: string | null
  assetId?: string | null
  assetType?: string | null
  assetCategory?: string | null
  title?: string | null
  fileName?: string | null
  mimeType?: string | null
  fileSizeBytes?: number | null
  storagePath?: string | null
  status?: string | null
  linkedEntityType?: string | null
  linkedEntityId?: string | null
  tags?: string[]
  metadata?: Record<string, unknown>
  createdBy?: string | null
  createdAt?: string
}

export type AssetBuildErrorCode =
  | "WORKSPACE_ID_REQUIRED"
  | "TITLE_REQUIRED"
  | "FILE_NAME_REQUIRED"
  | "STORAGE_PATH_REQUIRED"
  | "INVALID_ASSET_TYPE"
  | "INVALID_ASSET_CATEGORY"
  | "INVALID_ASSET_STATUS"
  | "INVALID_LINKED_ENTITY_TYPE"
  | "INVALID_FILE_SIZE"
  | "INVALID_CREATED_AT"

export type AssetBuildResult =
  | { ok: true; asset: GovernedAsset }
  | { ok: false; error: { code: AssetBuildErrorCode; message: string } }

export type AssetAdminRepository = {
  listAssets(input: {
    workspaceId: string
    limit: number
  }): Promise<readonly GovernedAsset[]>
  createAsset(asset: GovernedAsset): Promise<GovernedAsset>
}

export type AssetAdminResult<T> =
  | { ok: true; mode: typeof ASSET_GOVERNANCE_TEST_MODE; data: T }
  | {
      ok: false
      mode: typeof ASSET_GOVERNANCE_TEST_MODE
      error: { code: string; message: string }
    }

export type AssetSummary = {
  workspaceId: string
  totalAssets: number
  byType: Record<AssetType, number>
  byCategory: Record<AssetCategory, number>
  byStatus: Record<AssetStatus, number>
  totalSizeBytes: number
  latestCreatedAt: string | null
  flags: {
    mode: typeof ASSET_GOVERNANCE_TEST_MODE
    testInternalAdminOnly: true
    productionActivation: false
    realFileUpload: false
    productionStorageGovernance: false
  }
  warnings: string[]
}

export function isAssetType(value: string): value is AssetType {
  return assetTypes.includes(value as AssetType)
}

export function isAssetCategory(value: string): value is AssetCategory {
  return assetCategories.includes(value as AssetCategory)
}

export function isAssetStatus(value: string): value is AssetStatus {
  return assetStatuses.includes(value as AssetStatus)
}

export function isAssetLinkedEntityType(
  value: string
): value is AssetLinkedEntityType {
  return assetLinkedEntityTypes.includes(value as AssetLinkedEntityType)
}

export function normalizeRequiredString(value?: string | null): string | null {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

export function assetWarnings(): string[] {
  return [
    "TEST/internal/admin support only.",
    "Asset governance does not implement real file upload or storage movement.",
    "Asset events do not activate production file/evidence governance.",
    "Song/submission/evidence workflows remain TEST-only.",
  ]
}

export function testFlags(): AssetSummary["flags"] {
  return {
    mode: LIFECYCLE_TEST_MODE,
    testInternalAdminOnly: true,
    productionActivation: false,
    realFileUpload: false,
    productionStorageGovernance: false,
  }
}

export function emptyAssetSummaryCounters() {
  return {
    byType: Object.fromEntries(assetTypes.map((key) => [key, 0])) as Record<
      AssetType,
      number
    >,
    byCategory: Object.fromEntries(
      assetCategories.map((key) => [key, 0])
    ) as Record<AssetCategory, number>,
    byStatus: Object.fromEntries(assetStatuses.map((key) => [key, 0])) as Record<
      AssetStatus,
      number
    >,
  }
}
