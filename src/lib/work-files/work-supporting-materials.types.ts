export const WORK_SUPPORTING_MATERIALS_SOURCE =
  "canonical_work_supporting_materials_v1"

export const WORK_SUPPORTING_MATERIALS_MODE = "supporting_materials"

export const supportingMaterialCategories = [
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

export type SupportingMaterialCategory =
  (typeof supportingMaterialCategories)[number]

export const supportingMaterialPurposes = [
  "lyrics",
  "demo",
  "artwork",
  "split_sheet",
  "agreement",
  "metadata_reference",
  "audio_reference",
  "proof_of_creation",
  "licensing_reference",
  "other",
] as const

export type SupportingMaterialPurpose =
  (typeof supportingMaterialPurposes)[number]

export const supportingMaterialReferenceTypes = [
  "reference",
  "evidence_candidate",
  "operational_document",
  "public_media",
  "internal_note",
] as const

export type SupportingMaterialReferenceType =
  (typeof supportingMaterialReferenceTypes)[number]

export const supportingMaterialVisibilityOptions = [
  "private",
  "workspace",
  "public_safe_candidate",
] as const

export type SupportingMaterialVisibility =
  (typeof supportingMaterialVisibilityOptions)[number]

export const supportingMaterialUsageContexts = [
  "song_profile",
  "rights_admin",
  "publishing",
  "release_preparation",
  "licensing",
  "public_showcase_candidate",
  "evidence_support",
] as const

export type SupportingMaterialUsageContext =
  (typeof supportingMaterialUsageContexts)[number]

export type SupportingMaterialPublicSafeStatus =
  | "private_only"
  | "candidate"
  | "approved_later"
  | "not_applicable"

export type SupportingMaterialVerificationStatus =
  | "not_verified"
  | "verified_later"
  | "unknown"

export type SupportingMaterialLineageSourceType =
  | "manual_reference"
  | "uploaded_file"
  | "external_link"
  | "generated_export"
  | "legacy_reference"
  | "unknown"

export type WorkSupportingMaterial = {
  id: string
  link_id: string
  file_name: string
  file_category: SupportingMaterialCategory
  reference_status: "reference_only" | "not_verified"
  reference_text: string | null
  notes: string | null
  purpose: SupportingMaterialPurpose | null
  referenceType: SupportingMaterialReferenceType | null
  visibility: SupportingMaterialVisibility | null
  usageContext: SupportingMaterialUsageContext | null
  publicSafeStatus: SupportingMaterialPublicSafeStatus
  evidenceCandidate: boolean
  verificationStatus: SupportingMaterialVerificationStatus
  lineageSourceType: SupportingMaterialLineageSourceType
  file_mime_type: string | null
  file_size_bytes: number | null
  created_at: string
}

export type WorkSupportingMaterialsResponse = {
  success: true
  materials: WorkSupportingMaterial[]
  source: typeof WORK_SUPPORTING_MATERIALS_SOURCE
  mode: typeof WORK_SUPPORTING_MATERIALS_MODE
  disclaimer: string
}

export type CreateWorkSupportingMaterialInput = {
  file_name?: unknown
  file_category?: unknown
  reference_text?: unknown
  notes?: unknown
  purpose?: unknown
  referenceType?: unknown
  visibility?: unknown
  usageContext?: unknown
}

export type CreateWorkSupportingMaterialPayload = {
  fileName: string
  fileCategory: SupportingMaterialCategory
  referenceText: string | null
  notes: string | null
  purpose: SupportingMaterialPurpose | null
  referenceType: SupportingMaterialReferenceType | null
  visibility: SupportingMaterialVisibility | null
  usageContext: SupportingMaterialUsageContext | null
  publicSafeStatus: "private_only"
  evidenceCandidate: boolean
}

export const SUPPORTING_MATERIALS_DISCLAIMER =
  "Reference only. These supporting materials are not verified and do not confirm legal clearance or submission readiness."
