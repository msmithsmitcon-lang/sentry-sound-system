import {
  SUPPORTING_MATERIALS_DISCLAIMER,
  WORK_SUPPORTING_MATERIALS_MODE,
  WORK_SUPPORTING_MATERIALS_SOURCE,
  supportingMaterialCategories,
  supportingMaterialPurposes,
  supportingMaterialReferenceTypes,
  supportingMaterialUsageContexts,
  supportingMaterialVisibilityOptions,
  type CreateWorkSupportingMaterialInput,
  type CreateWorkSupportingMaterialPayload,
  type SupportingMaterialCategory,
  type SupportingMaterialPurpose,
  type SupportingMaterialReferenceType,
  type SupportingMaterialUsageContext,
  type SupportingMaterialVisibility,
  type WorkSupportingMaterialsResponse,
} from "./work-supporting-materials.types"
import {
  canonicalWorkExistsForWorkspace,
  createWorkSupportingMaterialReference,
  getWorkSupportingMaterialRows,
} from "./work-supporting-materials-repository"

export async function getWorkSupportingMaterials(input: {
  workId: string
  workspaceId: string
}): Promise<WorkSupportingMaterialsResponse> {
  await assertWorkOwnership(input.workId, input.workspaceId)

  const materials = await getWorkSupportingMaterialRows(
    input.workId,
    input.workspaceId
  )

  return {
    success: true,
    materials: materials.map(normalizeMaterial),
    source: WORK_SUPPORTING_MATERIALS_SOURCE,
    mode: WORK_SUPPORTING_MATERIALS_MODE,
    disclaimer: SUPPORTING_MATERIALS_DISCLAIMER,
  }
}

export async function createWorkSupportingMaterial(input: {
  workId: string
  workspaceId: string
  createdByUserId: string
  body: CreateWorkSupportingMaterialInput
}): Promise<WorkSupportingMaterialsResponse> {
  await assertWorkOwnership(input.workId, input.workspaceId)

  const payload = validateCreatePayload(input.body)
  await createWorkSupportingMaterialReference({
    workId: input.workId,
    workspaceId: input.workspaceId,
    createdByUserId: input.createdByUserId,
    payload,
  })

  return getWorkSupportingMaterials({
    workId: input.workId,
    workspaceId: input.workspaceId,
  })
}

async function assertWorkOwnership(workId: string, workspaceId: string) {
  const exists = await canonicalWorkExistsForWorkspace(workId, workspaceId)
  if (!exists) throw new Error("Work not found.")
}

function validateCreatePayload(
  body: CreateWorkSupportingMaterialInput
): CreateWorkSupportingMaterialPayload {
  const fileName = readRequiredString(body.file_name, "Material name is required.")
  const fileCategory = readCategory(body.file_category)
  const referenceType = readReferenceType(body.referenceType)

  return {
    fileName,
    fileCategory,
    referenceText: readOptionalString(body.reference_text),
    notes: readOptionalString(body.notes),
    purpose: readPurpose(body.purpose),
    referenceType,
    visibility: readVisibility(body.visibility),
    usageContext: readUsageContext(body.usageContext),
    publicSafeStatus: "private_only",
    evidenceCandidate: referenceType === "evidence_candidate",
  }
}

function readRequiredString(value: unknown, message: string) {
  if (typeof value !== "string" || !value.trim()) throw new Error(message)
  return value.trim()
}

function readOptionalString(value: unknown) {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

function readCategory(value: unknown): SupportingMaterialCategory {
  if (
    typeof value === "string" &&
    supportingMaterialCategories.includes(value as SupportingMaterialCategory)
  ) {
    return value as SupportingMaterialCategory
  }

  throw new Error("A valid material category is required.")
}

function readPurpose(value: unknown): SupportingMaterialPurpose | null {
  if (value === undefined || value === null || value === "") return null
  if (
    typeof value === "string" &&
    supportingMaterialPurposes.includes(value as SupportingMaterialPurpose)
  ) {
    return value as SupportingMaterialPurpose
  }

  throw new Error("A valid material purpose is required.")
}

function readReferenceType(value: unknown): SupportingMaterialReferenceType | null {
  if (value === undefined || value === null || value === "") return null
  if (
    typeof value === "string" &&
    supportingMaterialReferenceTypes.includes(value as SupportingMaterialReferenceType)
  ) {
    return value as SupportingMaterialReferenceType
  }

  throw new Error("A valid reference type is required.")
}

function readVisibility(value: unknown): SupportingMaterialVisibility | null {
  if (value === undefined || value === null || value === "") return null
  if (
    typeof value === "string" &&
    supportingMaterialVisibilityOptions.includes(value as SupportingMaterialVisibility)
  ) {
    return value as SupportingMaterialVisibility
  }

  throw new Error("A valid visibility option is required.")
}

function readUsageContext(value: unknown): SupportingMaterialUsageContext | null {
  if (value === undefined || value === null || value === "") return null
  if (
    typeof value === "string" &&
    supportingMaterialUsageContexts.includes(value as SupportingMaterialUsageContext)
  ) {
    return value as SupportingMaterialUsageContext
  }

  throw new Error("A valid usage context is required.")
}

function normalizeMaterial<
  T extends { created_at: string | Date; reference_status: string }
>(material: T) {
  return {
    ...material,
    reference_status:
      material.reference_status === "not_verified"
        ? "not_verified"
        : "reference_only",
    created_at:
      material.created_at instanceof Date
        ? material.created_at.toISOString()
        : material.created_at,
  }
}
