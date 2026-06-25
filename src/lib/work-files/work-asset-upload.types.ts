export const workAssetCategories = [
  "contract",
  "identity_kyc",
  "proof_of_ownership",
  "split_sheet",
  "master_audio",
  "artwork",
  "release_document",
  "compliance",
  "invoice",
  "statement",
  "other",
] as const

export type WorkAssetCategory = (typeof workAssetCategories)[number]

export type WorkAssetRecord = {
  id: string
  link_id: string
  file_name: string
  file_category: WorkAssetCategory
  file_mime_type: string | null
  file_size_bytes: number | null
  storage_bucket: string | null
  storage_path: string
  checksum: string | null
  created_at: string
}

export type WorkAssetsResponse = {
  success: true
  assets: WorkAssetRecord[]
}

export const MAX_WORK_ASSET_SIZE_BYTES = 5 * 1024 * 1024 * 1024 // 5GB, matches existing UI copy
