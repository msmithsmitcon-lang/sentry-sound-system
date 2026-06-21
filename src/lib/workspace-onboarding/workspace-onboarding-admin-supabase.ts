import { supabaseAdmin } from "@/lib/supabaseAdmin"

import {
  WorkspaceOnboardingAdminRepository,
  WorkspaceOnboardingSettings,
  WorkspaceOnboardingWorkspaceUpdate,
} from "./workspace-onboarding-admin"

export const workspaceOnboardingAdminSupabaseRepository: WorkspaceOnboardingAdminRepository =
  {
    async getWorkspace(workspaceId) {
      const { data, error } = await supabaseAdmin
        .from("workspaces")
        .select("id,name,legal_name,country_code,base_currency,status")
        .eq("id", workspaceId)
        .maybeSingle()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },

    async getWorkspaceSettings(workspaceId) {
      const { data, error } = await supabaseAdmin
        .from("workspace_settings")
        .select("settings")
        .eq("workspace_id", workspaceId)
        .maybeSingle()

      if (error) {
        throw new Error(error.message)
      }

      return (data?.settings as WorkspaceOnboardingSettings | undefined) ?? null
    },

    async updateWorkspaceIdentity(workspaceId, update) {
      const { data, error } = await supabaseAdmin
        .from("workspaces")
        .update({
          ...(update as WorkspaceOnboardingWorkspaceUpdate),
          updated_at: new Date().toISOString(),
        })
        .eq("id", workspaceId)
        .select("id,name,legal_name,country_code,base_currency,status")
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },

    async upsertWorkspaceSettings(workspaceId, settings) {
      const { data, error } = await supabaseAdmin
        .from("workspace_settings")
        .upsert(
          {
            workspace_id: workspaceId,
            settings,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "workspace_id" }
        )
        .select("settings")
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return (data.settings as WorkspaceOnboardingSettings | undefined) ?? {}
    },
  }
