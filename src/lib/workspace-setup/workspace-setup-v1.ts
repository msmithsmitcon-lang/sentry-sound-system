export const WORKSPACE_SETUP_V1_KEY = "workspace_setup_v1"

export const workspaceTypes = [
  "Artist",
  "Producer",
  "Label",
  "Publisher",
  "Studio",
  "Manager",
  "Rights Administrator",
  "Enterprise / Team",
  "Other",
] as const

export const businessStages = [
  "Just starting",
  "Growing",
  "Established",
  "Enterprise",
] as const

export const vatTaxRegisteredOptions = ["Yes", "No", "Not sure"] as const

export const primaryRoles = [
  "Artist",
  "Producer",
  "Manager",
  "Label Owner",
  "Publisher",
  "Studio Admin",
  "Rights Admin",
  "Finance/Admin",
  "Legal/Admin",
  "Other",
] as const

export const mainGoals = [
  "Organize my music operations",
  "Manage contributors and splits",
  "Prepare works for submission",
  "Manage files and evidence",
  "Manage releases/projects",
  "Improve marketing and growth",
  "Track royalties/finance later",
  "Learn the platform",
] as const

export const currentPainPoints = [
  "Scattered files and information",
  "Unclear contributor splits",
  "Missing agreements/evidence",
  "Hard to know what is ready",
  "Too much admin",
  "Team members are not aligned",
  "Royalty/payment confusion",
  "Need better marketing/workflow structure",
] as const

export const catalogSizes = [
  "No catalog yet",
  "1-10 works",
  "11-50 works",
  "51-200 works",
  "200+ works",
] as const

export const teamSizes = [
  "Just me",
  "2-5 people",
  "6-15 people",
  "16-50 people",
  "50+ people",
] as const

export const setupCountries = [
  { code: "ZA", label: "South Africa", currency: "ZAR", timezone: "Africa/Johannesburg" },
  { code: "US", label: "United States", currency: "USD", timezone: "America/New_York" },
  { code: "GB", label: "United Kingdom", currency: "GBP", timezone: "Europe/London" },
  { code: "NG", label: "Nigeria", currency: "NGN", timezone: "Africa/Lagos" },
  { code: "KE", label: "Kenya", currency: "KES", timezone: "Africa/Nairobi" },
  { code: "GH", label: "Ghana", currency: "GHS", timezone: "Africa/Accra" },
  { code: "OTHER", label: "Other", currency: "USD", timezone: null },
] as const

export const setupCurrencies = ["ZAR", "USD", "GBP", "EUR", "NGN", "KES", "GHS"] as const

export const setupTimezones = [
  "Africa/Johannesburg",
  "Africa/Lagos",
  "Africa/Nairobi",
  "Africa/Accra",
  "Europe/London",
  "America/New_York",
  "UTC",
] as const

export type WorkspaceSetupV1 = {
  workspace_name: string
  legal_or_trading_name: string
  workspace_type: (typeof workspaceTypes)[number]
  business_stage: (typeof businessStages)[number]
  country: string
  base_currency: string
  timezone: string | null
  vat_tax_registered: (typeof vatTaxRegisteredOptions)[number]
  primary_role: (typeof primaryRoles)[number]
  main_goal: (typeof mainGoals)[number]
  current_pain_point: (typeof currentPainPoints)[number]
  catalog_size: (typeof catalogSizes)[number]
  team_size: (typeof teamSizes)[number]
  invite_team_now: boolean
  add_first_work_now: boolean
  upload_first_file_now: boolean
  setup_status: "complete"
  setup_version: "v1"
  updated_at: string
  compliance_verification_excluded: true
}

export type WorkspaceSetupV1Payload = Partial<
  Omit<
    WorkspaceSetupV1,
    | "setup_status"
    | "setup_version"
    | "updated_at"
    | "compliance_verification_excluded"
  >
>

export type WorkspaceSetupV1Workspace = {
  id: string
  name: string | null
  legal_name?: string | null
  country_code?: string | null
  base_currency?: string | null
  status?: string | null
}

export type WorkspaceSetupV1Settings = Record<string, unknown>

export type WorkspaceSetupV1Repository = {
  getWorkspace(workspaceId: string): Promise<WorkspaceSetupV1Workspace | null>
  getWorkspaceSettings(workspaceId: string): Promise<WorkspaceSetupV1Settings | null>
  updateWorkspaceIdentity(
    workspaceId: string,
    update: {
      name?: string
      legal_name?: string
      country_code?: string
      base_currency?: string
    }
  ): Promise<WorkspaceSetupV1Workspace>
  upsertWorkspaceSettings(
    workspaceId: string,
    settings: WorkspaceSetupV1Settings
  ): Promise<WorkspaceSetupV1Settings>
}

export type WorkspaceSetupV1Summary = {
  workspace: WorkspaceSetupV1Workspace
  setup: WorkspaceSetupV1 | null
  completion: {
    complete: boolean
    completedRequiredFields: number
    totalRequiredFields: number
    percent: number
    missingFields: string[]
  }
  notices: string[]
}

export type WorkspaceSetupV1Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string; fields?: string[] } }

const requiredFields = [
  "workspace_name",
  "legal_or_trading_name",
  "workspace_type",
  "business_stage",
  "country",
  "base_currency",
  "vat_tax_registered",
  "primary_role",
  "main_goal",
  "current_pain_point",
  "catalog_size",
  "team_size",
] as const

export async function getWorkspaceSetupV1Summary(input: {
  repository: WorkspaceSetupV1Repository
  workspaceId: string
}): Promise<WorkspaceSetupV1Result<WorkspaceSetupV1Summary>> {
  const workspace = await input.repository.getWorkspace(input.workspaceId)
  if (!workspace) return fail("WORKSPACE_NOT_FOUND", "Workspace was not found.")

  const settings = (await input.repository.getWorkspaceSettings(input.workspaceId)) ?? {}
  const setup = readWorkspaceSetupV1(settings)

  return succeed({
    workspace,
    setup,
    completion: calculateCompletion(setup),
    notices: workspaceSetupNotices(),
  })
}

export async function saveWorkspaceSetupV1(input: {
  repository: WorkspaceSetupV1Repository
  workspaceId: string
  payload: WorkspaceSetupV1Payload
  now?: Date
}): Promise<WorkspaceSetupV1Result<WorkspaceSetupV1Summary>> {
  const workspace = await input.repository.getWorkspace(input.workspaceId)
  if (!workspace) return fail("WORKSPACE_NOT_FOUND", "Workspace was not found.")

  const validation = validateWorkspaceSetupV1Payload(input.payload)
  if (!validation.ok) {
    return fail(validation.code, validation.message, validation.fields)
  }

  const now = (input.now ?? new Date()).toISOString()
  const setup: WorkspaceSetupV1 = {
    workspace_name: normalizeRequired(input.payload.workspace_name),
    legal_or_trading_name: normalizeRequired(input.payload.legal_or_trading_name),
    workspace_type: input.payload.workspace_type!,
    business_stage: input.payload.business_stage!,
    country: normalizeRequired(input.payload.country).toUpperCase(),
    base_currency: normalizeRequired(input.payload.base_currency).toUpperCase(),
    timezone: normalizeOptional(input.payload.timezone),
    vat_tax_registered: input.payload.vat_tax_registered!,
    primary_role: input.payload.primary_role!,
    main_goal: input.payload.main_goal!,
    current_pain_point: input.payload.current_pain_point!,
    catalog_size: input.payload.catalog_size!,
    team_size: input.payload.team_size!,
    invite_team_now: input.payload.invite_team_now === true,
    add_first_work_now: input.payload.add_first_work_now === true,
    upload_first_file_now: input.payload.upload_first_file_now === true,
    setup_status: "complete",
    setup_version: "v1",
    updated_at: now,
    compliance_verification_excluded: true,
  }

  const updatedWorkspace = await input.repository.updateWorkspaceIdentity(input.workspaceId, {
    name: setup.workspace_name,
    legal_name: setup.legal_or_trading_name,
    country_code: setup.country,
    base_currency: setup.base_currency,
  })

  const existingSettings =
    (await input.repository.getWorkspaceSettings(input.workspaceId)) ?? {}
  const settings = await input.repository.upsertWorkspaceSettings(input.workspaceId, {
    ...existingSettings,
    [WORKSPACE_SETUP_V1_KEY]: setup,
  })

  const savedSetup = readWorkspaceSetupV1(settings) ?? setup
  return succeed({
    workspace: updatedWorkspace,
    setup: savedSetup,
    completion: calculateCompletion(savedSetup),
    notices: workspaceSetupNotices(),
  })
}

export function validateWorkspaceSetupV1Payload(payload: WorkspaceSetupV1Payload):
  | { ok: true }
  | { ok: false; code: string; message: string; fields?: string[] } {
  const missing = requiredFields.filter((field) => !normalizeOptional(payload[field]))
  if (missing.length > 0) {
    return {
      ok: false,
      code: "MISSING_REQUIRED_FIELDS",
      message: "Required setup fields are missing.",
      fields: [...missing],
    }
  }

  const checks: Array<[string, readonly string[] | undefined, unknown]> = [
    ["workspace_type", workspaceTypes, payload.workspace_type],
    ["business_stage", businessStages, payload.business_stage],
    ["vat_tax_registered", vatTaxRegisteredOptions, payload.vat_tax_registered],
    ["primary_role", primaryRoles, payload.primary_role],
    ["main_goal", mainGoals, payload.main_goal],
    ["current_pain_point", currentPainPoints, payload.current_pain_point],
    ["catalog_size", catalogSizes, payload.catalog_size],
    ["team_size", teamSizes, payload.team_size],
    ["base_currency", setupCurrencies, payload.base_currency?.toUpperCase()],
  ]

  for (const [field, allowed, value] of checks) {
    if (!allowed?.includes(String(value) as never)) {
      return {
        ok: false,
        code: "INVALID_SETUP_FIELD",
        message: `${field} is not allowed.`,
        fields: [field],
      }
    }
  }

  const country = normalizeRequired(payload.country).toUpperCase()
  if (!setupCountries.some((item) => item.code === country)) {
    return failValidation("country")
  }

  const timezone = normalizeOptional(payload.timezone)
  if (timezone && !setupTimezones.includes(timezone as never)) {
    return failValidation("timezone")
  }

  return { ok: true }
}

export function getDefaultCurrencyForCountry(country: string): string {
  return setupCountries.find((item) => item.code === country.toUpperCase())?.currency ?? "USD"
}

export function getDefaultTimezoneForCountry(country: string): string | null {
  return setupCountries.find((item) => item.code === country.toUpperCase())?.timezone ?? null
}

export function readWorkspaceSetupV1(
  settings: WorkspaceSetupV1Settings
): WorkspaceSetupV1 | null {
  const raw = settings[WORKSPACE_SETUP_V1_KEY]
  if (!raw || typeof raw !== "object") return null
  const record = raw as Record<string, unknown>

  const payload: WorkspaceSetupV1Payload = {
    workspace_name: readString(record.workspace_name),
    legal_or_trading_name: readString(record.legal_or_trading_name),
    workspace_type: readString(record.workspace_type) as WorkspaceSetupV1["workspace_type"],
    business_stage: readString(record.business_stage) as WorkspaceSetupV1["business_stage"],
    country: readString(record.country),
    base_currency: readString(record.base_currency),
    timezone: readString(record.timezone),
    vat_tax_registered: readString(record.vat_tax_registered) as WorkspaceSetupV1["vat_tax_registered"],
    primary_role: readString(record.primary_role) as WorkspaceSetupV1["primary_role"],
    main_goal: readString(record.main_goal) as WorkspaceSetupV1["main_goal"],
    current_pain_point: readString(record.current_pain_point) as WorkspaceSetupV1["current_pain_point"],
    catalog_size: readString(record.catalog_size) as WorkspaceSetupV1["catalog_size"],
    team_size: readString(record.team_size) as WorkspaceSetupV1["team_size"],
    invite_team_now: record.invite_team_now === true,
    add_first_work_now: record.add_first_work_now === true,
    upload_first_file_now: record.upload_first_file_now === true,
  }

  const validation = validateWorkspaceSetupV1Payload(payload)
  if (!validation.ok) return null

  return {
    ...(payload as Required<WorkspaceSetupV1Payload>),
    timezone: normalizeOptional(payload.timezone),
    invite_team_now: payload.invite_team_now === true,
    add_first_work_now: payload.add_first_work_now === true,
    upload_first_file_now: payload.upload_first_file_now === true,
    setup_status: "complete",
    setup_version: "v1",
    updated_at: readString(record.updated_at) ?? "",
    compliance_verification_excluded: true,
  }
}

export function calculateCompletion(setup: WorkspaceSetupV1 | null) {
  const completedRequiredFields = setup
    ? requiredFields.filter((field) => normalizeOptional(setup[field])).length
    : 0
  const missingFields = setup
    ? requiredFields.filter((field) => !normalizeOptional(setup[field]))
    : [...requiredFields]
  const totalRequiredFields = requiredFields.length
  return {
    complete: completedRequiredFields === totalRequiredFields,
    completedRequiredFields,
    totalRequiredFields,
    percent: Math.round((completedRequiredFields / totalRequiredFields) * 100),
    missingFields,
  }
}

export function workspaceSetupNotices(): string[] {
  return [
    "Workspace Setup V1 captures operational identity only.",
    "This is not compliance, KYC, tax clearance, banking, or company-registration verification.",
    "The data supports future templates, finance defaults, marketing segmentation, onboarding guidance, and dashboard recommendations.",
  ]
}

function normalizeRequired(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

function normalizeOptional(value: unknown): string | null {
  const normalized = normalizeRequired(value)
  return normalized ? normalized : null
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function failValidation(field: string) {
  return {
    ok: false as const,
    code: "INVALID_SETUP_FIELD",
    message: `${field} is not allowed.`,
    fields: [field],
  }
}

function succeed<T>(data: T): WorkspaceSetupV1Result<T> {
  return { ok: true, data }
}

function fail<T = never>(
  code: string,
  message: string,
  fields?: string[]
): WorkspaceSetupV1Result<T> {
  return { ok: false, error: { code, message, fields } }
}
