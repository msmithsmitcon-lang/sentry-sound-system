import { createHash } from "crypto"

import {
  canonicalWorkExistsForWorkspace,
  createWorkAssetRecord,
  getWorkAssetRows,
  uploadWorkAssetToStorage,
} from "./work-asset-storage-repository"
import {
  MAX_WORK_ASSET_SIZE_BYTES,
  workAssetCategories,
  type WorkAssetCategory,
  type WorkAssetsResponse,
} from "./work-asset-upload.types"

export async function listWorkAssets(input: {
  workId: string
  workspaceId: string
}): Promise<WorkAssetsResponse> {
  await assertWorkOwnership(input.workId, input.workspaceId)

  const assets = await getWorkAssetRows(input.workId, input.workspaceId)

  return { success: true, assets }
}

export async function uploadWorkAsset(input: {
  workId: string
  workspaceId: string
  createdByUserId: string
  fileName: string
  fileCategory: unknown
  mimeType: string | null
  bytes: Buffer
}): Promise<WorkAssetsResponse> {
  await assertWorkOwnership(input.workId, input.workspaceId)

  if (!input.fileName || !input.fileName.trim()) {
    throw new Error("A file name is required.")
  }

  if (input.bytes.byteLength === 0) {
    throw new Error("The uploaded file is empty.")
  }

  if (input.bytes.byteLength > MAX_WORK_ASSET_SIZE_BYTES) {
    throw new Error("File exceeds the 5GB maximum.")
  }

  const fileCategory = readCategory(input.fileCategory)
  const checksum = createHash("sha256").update(input.bytes).digest("hex")

  const { storagePath } = await uploadWorkAssetToStorage({
    workspaceId: input.workspaceId,
    workId: input.workId,
    fileName: input.fileName,
    mimeType: input.mimeType,
    bytes: input.bytes,
  })

  await createWorkAssetRecord({
    workId: input.workId,
    workspaceId: input.workspaceId,
    createdByUserId: input.createdByUserId,
    fileName: input.fileName,
    fileCategory,
    mimeType: input.mimeType,
    sizeBytes: input.bytes.byteLength,
    storagePath,
    checksum,
  })

  return listWorkAssets({ workId: input.workId, workspaceId: input.workspaceId })
}

async function assertWorkOwnership(workId: string, workspaceId: string) {
  const exists = await canonicalWorkExistsForWorkspace(workId, workspaceId)
  if (!exists) throw new Error("Work not found.")
}

function readCategory(value: unknown): WorkAssetCategory {
  if (typeof value === "string" && workAssetCategories.includes(value as WorkAssetCategory)) {
    return value as WorkAssetCategory
  }
  return "other"
}
