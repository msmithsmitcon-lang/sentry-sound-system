import {
  calculateCompletion,
  readWorkspaceSetupV1,
  saveWorkspaceSetupV1,
  validateWorkspaceSetupV1Payload,
  WorkspaceSetupV1Repository,
  WorkspaceSetupV1Settings,
} from "./workspace-setup-v1"

const validPayload = {
  workspace_name: "Moonlit Ops",
  legal_or_trading_name: "Moonlit Ops Pty Ltd",
  workspace_type: "Label",
  business_stage: "Growing",
  country: "ZA",
  base_currency: "ZAR",
  timezone: "Africa/Johannesburg",
  vat_tax_registered: "Not sure",
  primary_role: "Label Owner",
  main_goal: "Organize my music operations",
  current_pain_point: "Scattered files and information",
  catalog_size: "1-10 works",
  team_size: "2-5 people",
  invite_team_now: true,
  add_first_work_now: false,
  upload_first_file_now: false,
} as const

function createRepository(): WorkspaceSetupV1Repository & {
  settings: WorkspaceSetupV1Settings
} {
  return {
    settings: {},
    async getWorkspace() {
      return {
        id: "workspace_1",
        name: "Old Workspace",
        legal_name: null,
        country_code: null,
        base_currency: null,
        status: "active",
      }
    },
    async getWorkspaceSettings() {
      return this.settings
    },
    async updateWorkspaceIdentity(_workspaceId, update) {
      return {
        id: "workspace_1",
        name: update.name ?? null,
        legal_name: update.legal_name ?? null,
        country_code: update.country_code ?? null,
        base_currency: update.base_currency ?? null,
        status: "active",
      }
    },
    async upsertWorkspaceSettings(_workspaceId, settings) {
      this.settings = settings
      return this.settings
    },
  }
}

async function run() {
  if (!validateWorkspaceSetupV1Payload(validPayload).ok) {
    throw new Error("Expected valid setup payload.")
  }

  const invalid = validateWorkspaceSetupV1Payload({
    ...validPayload,
    workspace_type: "Compliance Office",
  })
  if (invalid.ok || invalid.fields?.[0] !== "workspace_type") {
    throw new Error("Expected invalid workspace type to fail.")
  }

  const missing = validateWorkspaceSetupV1Payload({
    ...validPayload,
    workspace_name: "",
  })
  if (missing.ok) {
    throw new Error("Expected missing workspace name to fail.")
  }

  const repository = createRepository()
  const result = await saveWorkspaceSetupV1({
    repository,
    workspaceId: "workspace_1",
    payload: validPayload,
    now: new Date("2026-05-18T10:00:00.000Z"),
  })

  if (!result.ok) throw new Error(result.error.message)
  if (!result.data.setup?.compliance_verification_excluded) {
    throw new Error("Expected compliance exclusion marker.")
  }
  if (result.data.workspace.name !== validPayload.workspace_name) {
    throw new Error("Expected workspace identity update.")
  }
  if (!readWorkspaceSetupV1(repository.settings)) {
    throw new Error("Expected setup to persist in workspace settings.")
  }
  if (calculateCompletion(result.data.setup).percent !== 100) {
    throw new Error("Expected complete setup.")
  }

  console.log("Workspace setup V1 tests passed")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
