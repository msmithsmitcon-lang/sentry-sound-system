import { createAsset, getAssetSummary, listAssets } from "./asset-admin"
import { AssetAdminRepository, GovernedAsset } from "./asset-governance"

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const workspaceId = "11111111-1111-4111-8111-111111111111"

function createRepository(assets: GovernedAsset[] = []): AssetAdminRepository & {
  assets: GovernedAsset[]
} {
  return {
    assets,
    async listAssets(input) {
      return assets
        .filter((asset) => asset.workspaceId === input.workspaceId)
        .slice(0, input.limit)
    },
    async createAsset(asset) {
      assets.unshift(asset)
      return asset
    },
  }
}

async function run() {
  const repository = createRepository()

  const valid = await createAsset({
    repository,
    asset: {
      assetId: "asset_1",
      workspaceId,
      assetType: "image",
      assetCategory: "artwork",
      title: "Cover Artwork",
      fileName: "cover.png",
      mimeType: "image/png",
      fileSizeBytes: 1200,
      storagePath: "test/workspace/cover.png",
      status: "uploaded",
      linkedEntityType: "song",
      linkedEntityId: "song_1",
      tags: ["cover", "test"],
      metadata: { source: "test" },
      createdBy: "user_1",
      createdAt: "2026-05-18T12:00:00.000Z",
    },
  })

  assert(valid.ok, "Valid asset event must be accepted.")
  assert(
    valid.ok && (valid.data.asset as GovernedAsset).productionActivation === false,
    "Asset event must not activate production."
  )
  assert(
    valid.ok && Boolean((valid.data.asset as GovernedAsset).auditEvent),
    "Asset event must include audit event shape."
  )
  assert(
    valid.ok && Boolean((valid.data.asset as GovernedAsset).lifecycleEvent),
    "Asset event must include lifecycle event shape."
  )

  const invalidType = await createAsset({
    repository,
    asset: {
      workspaceId,
      assetType: "binary",
      assetCategory: "artwork",
      title: "Bad",
      fileName: "bad.bin",
      storagePath: "bad.bin",
      status: "uploaded",
    },
  })

  assert(!invalidType.ok, "Invalid asset type must be rejected.")
  assert(
    !invalidType.ok && invalidType.error.code === "INVALID_ASSET_TYPE",
    "Invalid asset type must return INVALID_ASSET_TYPE."
  )

  const invalidStatus = await createAsset({
    repository,
    asset: {
      workspaceId,
      assetType: "image",
      assetCategory: "artwork",
      title: "Bad",
      fileName: "bad.png",
      storagePath: "bad.png",
      status: "published",
    },
  })

  assert(!invalidStatus.ok, "Invalid status must be rejected.")
  assert(
    !invalidStatus.ok && invalidStatus.error.code === "INVALID_ASSET_STATUS",
    "Invalid status must return INVALID_ASSET_STATUS."
  )

  const listed = await listAssets({ repository, workspaceId })
  assert(listed.ok, "Asset list shape must succeed.")
  assert(listed.ok && listed.data.assets.length === 1, "Asset list must include created asset.")

  const summary = await getAssetSummary({ repository, workspaceId })
  assert(summary.ok, "Asset summary shape must succeed.")
  assert(summary.ok && summary.data.totalAssets === 1, "Summary must count assets.")
  assert(summary.ok && summary.data.byType.image === 1, "Summary must count image asset.")
  assert(
    summary.ok && summary.data.flags.productionActivation === false,
    "Summary must not activate production."
  )
  assert(
    summary.ok &&
      summary.data.warnings.some((warning) =>
        warning.includes("Song/submission/evidence workflows remain TEST-only")
      ),
    "Summary must include TEST-only warning."
  )

  console.log("Asset admin tests passed")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
