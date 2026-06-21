export const WORKSPACE_ONBOARDING_ADMIN_MODE = "TEST_INTERNAL_ADMIN_ONLY"

export const workspaceOnboardingVatStatuses = [
  "yes",
  "no",
  "exempt",
  "pending",
] as const

export const workspaceOnboardingSteps = [
  "profile",
  "legal_entity",
  "tax",
  "address",
  "subscription",
  "review",
  "complete",
] as const

export const workspaceOnboardingStatuses = [
  "not_started",
  "in_progress",
  "pending_review",
  "complete",
  "blocked",
] as const

export type WorkspaceOnboardingVatStatus =
  (typeof workspaceOnboardingVatStatuses)[number]

export type WorkspaceOnboardingStep =
  (typeof workspaceOnboardingSteps)[number]

export type WorkspaceOnboardingStatus =
  (typeof workspaceOnboardingStatuses)[number]

export type WorkspaceOnboardingAdminWorkspace = {
  id: string
  name: string | null
  legal_name?: string | null
  country_code?: string | null
  base_currency?: string | null
  status: string | null
}

export type WorkspaceOnboardingSettings = Record<string, unknown>

export type WorkspaceOnboardingDetails = {
  workspace_name: string | null
  company_entity_name: string | null
  country: string | null
  currency: string | null
  vat_tax_id: string | null
  vat_status: WorkspaceOnboardingVatStatus
  business_type: string | null
  address_line_1: string | null
  address_line_2: string | null
  city: string | null
  state_province: string | null
  postal_code: string | null
  onboarding_step: WorkspaceOnboardingStep
  onboarding_status: WorkspaceOnboardingStatus
  updated_at: string | null
  mode: typeof WORKSPACE_ONBOARDING_ADMIN_MODE
  production_activation: false
}

export type WorkspaceOnboardingPayload = {
  workspaceId: string
  workspaceName?: string | null
  companyEntityName?: string | null
  country?: string | null
  currency?: string | null
  vatTaxId?: string | null
  vatStatus?: string | null
  businessType?: string | null
  addressLine1?: string | null
  addressLine2?: string | null
  city?: string | null
  stateProvince?: string | null
  postalCode?: string | null
  onboardingStep?: string | null
  onboardingStatus?: string | null
}

export type WorkspaceOnboardingWorkspaceUpdate = {
  name?: string
  legal_name?: string | null
  country_code?: string | null
  base_currency?: string | null
}

export type WorkspaceOnboardingAdminRepository = {
  getWorkspace(
    workspaceId: string
  ): Promise<WorkspaceOnboardingAdminWorkspace | null>
  getWorkspaceSettings(
    workspaceId: string
  ): Promise<WorkspaceOnboardingSettings | null>
  updateWorkspaceIdentity(
    workspaceId: string,
    update: WorkspaceOnboardingWorkspaceUpdate
  ): Promise<WorkspaceOnboardingAdminWorkspace>
  upsertWorkspaceSettings(
    workspaceId: string,
    settings: WorkspaceOnboardingSettings
  ): Promise<WorkspaceOnboardingSettings>
}

export type WorkspaceOnboardingAdminResult<T> =
  | {
      ok: true
      mode: typeof WORKSPACE_ONBOARDING_ADMIN_MODE
      data: T
    }
  | {
      ok: false
      mode: typeof WORKSPACE_ONBOARDING_ADMIN_MODE
      error: {
        code: string
        message: string
      }
    }

export type WorkspaceOnboardingSummary = {
  workspace: WorkspaceOnboardingAdminWorkspace
  onboarding: WorkspaceOnboardingDetails
  settings: WorkspaceOnboardingSettings
  notices: string[]
}

export async function getWorkspaceOnboardingSummary(input: {
  repository: WorkspaceOnboardingAdminRepository
  workspaceId?: string | null
}): Promise<WorkspaceOnboardingAdminResult<WorkspaceOnboardingSummary>> {
  const workspaceId = normalizeWorkspaceId(input.workspaceId)

  if (!workspaceId) {
    return fail("INVALID_WORKSPACE_ID", "workspace_id must be a UUID.")
  }

  const workspace = await input.repository.getWorkspace(workspaceId)

  if (!workspace) {
    return fail("WORKSPACE_NOT_FOUND", "Workspace was not found.")
  }

  const settings = (await input.repository.getWorkspaceSettings(workspaceId)) ?? {}

  return succeed({
    workspace,
    onboarding: buildOnboardingDetails(workspace, settings),
    settings,
    notices: testAdminNotices(),
  })
}

export async function saveWorkspaceOnboarding(input: {
  repository: WorkspaceOnboardingAdminRepository
  payload: WorkspaceOnboardingPayload
  now?: Date
}): Promise<WorkspaceOnboardingAdminResult<WorkspaceOnboardingSummary>> {
  const workspaceId = normalizeWorkspaceId(input.payload.workspaceId)

  if (!workspaceId) {
    return fail("INVALID_WORKSPACE_ID", "workspace_id must be a UUID.")
  }

  const validation = validateOnboardingPayload(input.payload)

  if (!validation.ok) {
    return fail(validation.code, validation.message)
  }

  const workspace = await input.repository.getWorkspace(workspaceId)

  if (!workspace) {
    return fail("WORKSPACE_NOT_FOUND", "Workspace was not found.")
  }

  const existingSettings =
    (await input.repository.getWorkspaceSettings(workspaceId)) ?? {}
  const existingOnboarding = readOnboardingSettings(existingSettings)
  const updatedAt = (input.now ?? new Date()).toISOString()
  const nextOnboarding: WorkspaceOnboardingDetails = {
    workspace_name: normalizeNullableString(input.payload.workspaceName) ?? workspace.name,
    company_entity_name:
      normalizeNullableString(input.payload.companyEntityName) ??
      existingOnboarding.company_entity_name ??
      workspace.legal_name ??
      null,
    country:
      normalizeCode(input.payload.country) ??
      existingOnboarding.country ??
      workspace.country_code ??
      null,
    currency:
      normalizeCode(input.payload.currency) ??
      existingOnboarding.currency ??
      workspace.base_currency ??
      null,
    vat_tax_id:
      normalizeNullableString(input.payload.vatTaxId) ??
      existingOnboarding.vat_tax_id,
    vat_status:
      (input.payload.vatStatus as WorkspaceOnboardingVatStatus | undefined) ??
      existingOnboarding.vat_status,
    business_type:
      normalizeNullableString(input.payload.businessType) ??
      existingOnboarding.business_type,
    address_line_1:
      normalizeNullableString(input.payload.addressLine1) ??
      existingOnboarding.address_line_1,
    address_line_2:
      normalizeNullableString(input.payload.addressLine2) ??
      existingOnboarding.address_line_2,
    city:
      normalizeNullableString(input.payload.city) ?? existingOnboarding.city,
    state_province:
      normalizeNullableString(input.payload.stateProvince) ??
      existingOnboarding.state_province,
    postal_code:
      normalizeNullableString(input.payload.postalCode) ??
      existingOnboarding.postal_code,
    onboarding_step:
      (input.payload.onboardingStep as WorkspaceOnboardingStep | undefined) ??
      existingOnboarding.onboarding_step,
    onboarding_status:
      (input.payload.onboardingStatus as WorkspaceOnboardingStatus | undefined) ??
      existingOnboarding.onboarding_status,
    updated_at: updatedAt,
    mode: WORKSPACE_ONBOARDING_ADMIN_MODE,
    production_activation: false,
  }

  const workspaceUpdate: WorkspaceOnboardingWorkspaceUpdate = {}
  const workspaceName = normalizeNullableString(input.payload.workspaceName)

  if (workspaceName) {
    workspaceUpdate.name = workspaceName
  }

  if ("companyEntityName" in input.payload) {
    workspaceUpdate.legal_name = normalizeNullableString(
      input.payload.companyEntityName
    )
  }

  if ("country" in input.payload) {
    workspaceUpdate.country_code = normalizeCode(input.payload.country)
  }

  if ("currency" in input.payload) {
    workspaceUpdate.base_currency = normalizeCode(input.payload.currency)
  }

  const updatedWorkspace =
    Object.keys(workspaceUpdate).length > 0
      ? await input.repository.updateWorkspaceIdentity(
          workspaceId,
          workspaceUpdate
        )
      : workspace

  const settings = await input.repository.upsertWorkspaceSettings(workspaceId, {
    ...existingSettings,
    workspace_onboarding: nextOnboarding,
  })

  return succeed({
    workspace: updatedWorkspace,
    onboarding: buildOnboardingDetails(updatedWorkspace, settings),
    settings,
    notices: testAdminNotices(),
  })
}

function validateOnboardingPayload(payload: WorkspaceOnboardingPayload):
  | { ok: true }
  | { ok: false; code: string; message: string } {
  if (
    payload.vatStatus &&
    !workspaceOnboardingVatStatuses.includes(
      payload.vatStatus as WorkspaceOnboardingVatStatus
    )
  ) {
    return {
      ok: false,
      code: "INVALID_VAT_STATUS",
      message: "vat_status must be yes, no, exempt, or pending.",
    }
  }

  if (
    payload.onboardingStep &&
    !workspaceOnboardingSteps.includes(
      payload.onboardingStep as WorkspaceOnboardingStep
    )
  ) {
    return {
      ok: false,
      code: "INVALID_ONBOARDING_STEP",
      message: "onboarding_step is not allowed.",
    }
  }

  if (
    payload.onboardingStatus &&
    !workspaceOnboardingStatuses.includes(
      payload.onboardingStatus as WorkspaceOnboardingStatus
    )
  ) {
    return {
      ok: false,
      code: "INVALID_ONBOARDING_STATUS",
      message: "onboarding_status is not allowed.",
    }
  }

  return { ok: true }
}

function buildOnboardingDetails(
  workspace: WorkspaceOnboardingAdminWorkspace,
  settings: WorkspaceOnboardingSettings
): WorkspaceOnboardingDetails {
  const onboarding = readOnboardingSettings(settings)

  return {
    workspace_name: onboarding.workspace_name ?? workspace.name ?? null,
    company_entity_name:
      onboarding.company_entity_name ?? workspace.legal_name ?? null,
    country: onboarding.country ?? workspace.country_code ?? null,
    currency: onboarding.currency ?? workspace.base_currency ?? null,
    vat_tax_id: onboarding.vat_tax_id,
    vat_status: onboarding.vat_status,
    business_type: onboarding.business_type,
    address_line_1: onboarding.address_line_1,
    address_line_2: onboarding.address_line_2,
    city: onboarding.city,
    state_province: onboarding.state_province,
    postal_code: onboarding.postal_code,
    onboarding_step: onboarding.onboarding_step,
    onboarding_status: onboarding.onboarding_status,
    updated_at: onboarding.updated_at,
    mode: WORKSPACE_ONBOARDING_ADMIN_MODE,
    production_activation: false,
  }
}

function readOnboardingSettings(
  settings: WorkspaceOnboardingSettings
): WorkspaceOnboardingDetails {
  const raw = settings.workspace_onboarding
  const onboarding =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {}

  return {
    workspace_name: readNullableString(onboarding.workspace_name),
    company_entity_name: readNullableString(onboarding.company_entity_name),
    country: readNullableString(onboarding.country),
    currency: readNullableString(onboarding.currency),
    vat_tax_id: readNullableString(onboarding.vat_tax_id),
    vat_status: readVatStatus(onboarding.vat_status),
    business_type: readNullableString(onboarding.business_type),
    address_line_1: readNullableString(onboarding.address_line_1),
    address_line_2: readNullableString(onboarding.address_line_2),
    city: readNullableString(onboarding.city),
    state_province: readNullableString(onboarding.state_province),
    postal_code: readNullableString(onboarding.postal_code),
    onboarding_step: readOnboardingStep(onboarding.onboarding_step),
    onboarding_status: readOnboardingStatus(onboarding.onboarding_status),
    updated_at: readNullableString(onboarding.updated_at),
    mode: WORKSPACE_ONBOARDING_ADMIN_MODE,
    production_activation: false,
  }
}

function readVatStatus(value: unknown): WorkspaceOnboardingVatStatus {
  return workspaceOnboardingVatStatuses.includes(value as WorkspaceOnboardingVatStatus)
    ? (value as WorkspaceOnboardingVatStatus)
    : "pending"
}

function readOnboardingStep(value: unknown): WorkspaceOnboardingStep {
  return workspaceOnboardingSteps.includes(value as WorkspaceOnboardingStep)
    ? (value as WorkspaceOnboardingStep)
    : "profile"
}

function readOnboardingStatus(value: unknown): WorkspaceOnboardingStatus {
  return workspaceOnboardingStatuses.includes(value as WorkspaceOnboardingStatus)
    ? (value as WorkspaceOnboardingStatus)
    : "not_started"
}

function readNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function normalizeNullableString(value?: string | null): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function normalizeCode(value?: string | null): string | null {
  return typeof value === "string" && value.trim()
    ? value.trim().toUpperCase()
    : null
}

function normalizeWorkspaceId(workspaceId?: string | null): string | null {
  const normalized = workspaceId?.trim()
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  return normalized && uuidPattern.test(normalized) ? normalized : null
}

function testAdminNotices(): string[] {
  return [
    "TEST/internal/admin support only.",
    "Onboarding settings do not activate production workflows.",
    "Workspace settings are not entitlement or billing truth.",
    "Song/submission/evidence workflows remain TEST-only.",
  ]
}

function succeed<T>(data: T): WorkspaceOnboardingAdminResult<T> {
  return {
    ok: true,
    mode: WORKSPACE_ONBOARDING_ADMIN_MODE,
    data,
  }
}

function fail<T = never>(
  code: string,
  message: string
): WorkspaceOnboardingAdminResult<T> {
  return {
    ok: false,
    mode: WORKSPACE_ONBOARDING_ADMIN_MODE,
    error: {
      code,
      message,
    },
  }
}
