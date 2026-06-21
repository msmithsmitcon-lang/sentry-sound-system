import {
  ASSET_GOVERNANCE_TEST_MODE,
  AssetAdminRepository,
  AssetAdminResult,
  AssetCreateInput,
  AssetSummary,
  assetWarnings,
  emptyAssetSummaryCounters,
  normalizeRequiredString,
  testFlags,
} from "./asset-governance"
import { buildAssetEvent } from "./asset-event-builder"

export async function listAssets(input: {
  repository: AssetAdminRepository
  workspaceId?: string | null
  limit?: number
}): Promise<AssetAdminResult<{ assets: readonly unknown[]; warnings: string[] }>> {
  const workspaceId = normalizeRequiredString(input.workspaceId)
  if (!workspaceId) return fail("WORKSPACE_ID_REQUIRED", "workspace_id is required.")

  const assets = await input.repository.listAssets({
    workspaceId,
    limit: normalizeLimit(input.limit),
  })
  return succeed({ assets, warnings: assetWarnings() })
}

export async function createAsset(input: {
  repository: AssetAdminRepository
  asset: AssetCreateInput
}): Promise<AssetAdminResult<{ asset: unknown; warnings: string[] }>> {
  const built = buildAssetEvent(input.asset)
  if (!built.ok) return fail(built.error.code, built.error.message)

  const asset = await input.repository.createAsset(built.asset)
  return succeed({ asset, warnings: assetWarnings() })
}

export async function getAssetSummary(input: {
  repository: AssetAdminRepository
  workspaceId?: string | null
  limit?: number
}): Promise<AssetAdminResult<AssetSummary>> {
  const listed = await listAssets(input)
  if (!listed.ok) return listed
  return succeed(
    buildAssetSummary({
      workspaceId: normalizeRequiredString(input.workspaceId) ?? "",
      assets: listed.data.assets as Parameters<typeof buildAssetSummary>[0]["assets"],
    })
  )
}

export function buildAssetSummary(input: {
  workspaceId: string
  assets: readonly import("./asset-governance").GovernedAsset[]
}): AssetSummary {
  const counters = emptyAssetSummaryCounters()
  let totalSizeBytes = 0
  let latestCreatedAt: string | null = null

  for (const asset of input.assets) {
    counters.byType[asset.assetType] += 1
    counters.byCategory[asset.assetCategory] += 1
    counters.byStatus[asset.status] += 1
    totalSizeBytes += asset.fileSizeBytes ?? 0
    if (!latestCreatedAt || asset.createdAt > latestCreatedAt) {
      latestCreatedAt = asset.createdAt
    }
  }

  return {
    workspaceId: input.workspaceId,
    totalAssets: input.assets.length,
    ...counters,
    totalSizeBytes,
    latestCreatedAt,
    flags: testFlags(),
    warnings: assetWarnings(),
  }
}

function normalizeLimit(limit?: number): number {
  if (!Number.isFinite(limit) || !limit) return 50
  return Math.min(Math.max(Math.trunc(limit), 1), 100)
}

function succeed<T>(data: T): AssetAdminResult<T> {
  return { ok: true, mode: ASSET_GOVERNANCE_TEST_MODE, data }
}

function fail<T = never>(code: string, message: string): AssetAdminResult<T> {
  return { ok: false, mode: ASSET_GOVERNANCE_TEST_MODE, error: { code, message } }
}
