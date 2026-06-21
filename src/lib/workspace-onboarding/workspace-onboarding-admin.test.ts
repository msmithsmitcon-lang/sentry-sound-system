import {
  getWorkspaceOnboardingSummary,
  saveWorkspaceOnboarding,
  WorkspaceOnboardingAdminRepository,
  WorkspaceOnboardingAdminWorkspace,
  WorkspaceOnboardingSettings,
  WorkspaceOnboardingWorkspaceUpdate,
} from "./workspace-onboarding-admin"

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

const workspaceId = "11111111-1111-4111-8111-111111111111"
const now = new Date("2026-05-18T12:00:00.000Z")

function createRepository(input?: {
  missingWorkspace?: boolean
  settings?: WorkspaceOnboardingSettings
}): WorkspaceOnboardingAdminRepository & {
  workspace: WorkspaceOnboardingAdminWorkspace
  settings: WorkspaceOnboardingSettings
  workspaceUpdates: WorkspaceOnboardingWorkspaceUpdate[]
} {
  const repository = {
    workspace: {
      id: workspaceId,
      name: "Sentry Sound Demo Workspace",
      legal_name: null,
      country_code: null,
      base_currency: null,
      status: "active",
    },
    settings: input?.settings ?? {},
    workspaceUpdates: [] as WorkspaceOnboardingWorkspaceUpdate[],
    async getWorkspace() {
      return input?.missingWorkspace ? null : repository.workspace
    },
    async getWorkspaceSettings() {
      return repository.settings
    },
    async updateWorkspaceIdentity(
      _workspaceId: string,
      update: WorkspaceOnboardingWorkspaceUpdate
    ) {
      repository.workspaceUpdates.push(update)
      repository.workspace = {
        ...repository.workspace,
        ...update,
      }
      return repository.workspace
    },
    async upsertWorkspaceSettings(
      _workspaceId: string,
      settings: WorkspaceOnboardingSettings
    ) {
      repository.settings = settings
      return repository.settings
    },
  }

  return repository
}

async function run() {
  const invalidWorkspaceId = await getWorkspaceOnboardingSummary({
    repository: createRepository(),
    workspaceId: "workspace_1",
  })

  assert(!invalidWorkspaceId.ok, "Invalid workspace id must fail.")
  assert(
    !invalidWorkspaceId.ok &&
      invalidWorkspaceId.error.code === "INVALID_WORKSPACE_ID",
    "Invalid workspace id must return INVALID_WORKSPACE_ID."
  )

  const invalidVatStatus = await saveWorkspaceOnboarding({
    repository: createRepository(),
    payload: {
      workspaceId,
      vatStatus: "registered",
    },
    now,
  })

  assert(!invalidVatStatus.ok, "Invalid VAT status must fail.")
  assert(
    !invalidVatStatus.ok &&
      invalidVatStatus.error.code === "INVALID_VAT_STATUS",
    "Invalid VAT status must return INVALID_VAT_STATUS."
  )

  const invalidStep = await saveWorkspaceOnboarding({
    repository: createRepository(),
    payload: {
      workspaceId,
      onboardingStep: "launch",
    },
    now,
  })

  assert(!invalidStep.ok, "Invalid onboarding step must fail.")
  assert(
    !invalidStep.ok &&
      invalidStep.error.code === "INVALID_ONBOARDING_STEP",
    "Invalid onboarding step must return INVALID_ONBOARDING_STEP."
  )

  const invalidStatus = await saveWorkspaceOnboarding({
    repository: createRepository(),
    payload: {
      workspaceId,
      onboardingStatus: "approved",
    },
    now,
  })

  assert(!invalidStatus.ok, "Invalid onboarding status must fail.")
  assert(
    !invalidStatus.ok &&
      invalidStatus.error.code === "INVALID_ONBOARDING_STATUS",
    "Invalid onboarding status must return INVALID_ONBOARDING_STATUS."
  )

  const repository = createRepository()
  const saved = await saveWorkspaceOnboarding({
    repository,
    payload: {
      workspaceId,
      workspaceName: "Cape Songs Workspace",
      companyEntityName: "Cape Songs Pty Ltd",
      country: "za",
      currency: "zar",
      vatTaxId: "4123456789",
      vatStatus: "pending",
      businessType: "artist",
      addressLine1: "1 Loop Street",
      addressLine2: "Studio 3",
      city: "Cape Town",
      stateProvince: "Western Cape",
      postalCode: "8001",
      onboardingStep: "review",
      onboardingStatus: "in_progress",
    },
    now,
  })

  assert(saved.ok, "Valid onboarding payload must save.")
  assert(
    repository.workspaceUpdates.length === 1,
    "Valid payload must update workspace identity once."
  )
  assert(
    saved.ok && saved.data.workspace.name === "Cape Songs Workspace",
    "Saved summary must include updated workspace name."
  )
  assert(
    saved.ok && saved.data.onboarding.country === "ZA",
    "Country must be normalized to uppercase."
  )
  assert(
    saved.ok && saved.data.onboarding.currency === "ZAR",
    "Currency must be normalized to uppercase."
  )
  assert(
    saved.ok && saved.data.onboarding.production_activation === false,
    "Onboarding save must not activate production."
  )

  const summary = await getWorkspaceOnboardingSummary({
    repository,
    workspaceId,
  })

  assert(summary.ok, "Onboarding summary shape must succeed.")
  assert(
    summary.ok &&
      summary.data.onboarding.company_entity_name === "Cape Songs Pty Ltd",
    "Summary must return saved company/entity name."
  )
  assert(
    summary.ok && Array.isArray(summary.data.notices),
    "Summary must include TEST/admin notices."
  )
  assert(
    summary.ok &&
      summary.data.notices.some((notice) =>
        notice.includes("Song/submission/evidence workflows remain TEST-only")
      ),
    "Summary must preserve TEST-only workflow notice."
  )

  const missingWorkspace = await getWorkspaceOnboardingSummary({
    repository: createRepository({ missingWorkspace: true }),
    workspaceId,
  })

  assert(!missingWorkspace.ok, "Missing workspace must fail.")
  assert(
    !missingWorkspace.ok &&
      missingWorkspace.error.code === "WORKSPACE_NOT_FOUND",
    "Missing workspace must return WORKSPACE_NOT_FOUND."
  )

  console.log("Workspace onboarding admin service tests passed")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
