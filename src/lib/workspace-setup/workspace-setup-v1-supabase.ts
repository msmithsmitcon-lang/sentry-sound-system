import { supabaseAdmin } from "@/lib/supabaseAdmin"

import {
  WorkspaceSetupV1Repository,
  WorkspaceSetupV1Settings,
} from "./workspace-setup-v1"

export const workspaceSetupV1SupabaseRepository: WorkspaceSetupV1Repository = {
  async getWorkspace(workspaceId) {
    const { data, error } = await supabaseAdmin
      .from("workspaces")
      .select("id,name,legal_name,country_code,base_currency,status")
      .eq("id", workspaceId)
      .maybeSingle()

    if (error) throw new Error(error.message)
    return data
  },

  async getWorkspaceSettings(workspaceId) {
    const { data, error } = await supabaseAdmin
      .from("workspace_settings")
      .select("settings")
      .eq("workspace_id", workspaceId)
      .maybeSingle()

    if (error) throw new Error(error.message)
    return (data?.settings as WorkspaceSetupV1Settings | undefined) ?? null
  },

  async updateWorkspaceIdentity(workspaceId, update) {
    const { data, error } = await supabaseAdmin
      .from("workspaces")
      .update({
        ...update,
        updated_at: new Date().toISOString(),
      })
      .eq("id", workspaceId)
      .select("id,name,legal_name,country_code,base_currency,status")
      .single()

    if (error) throw new Error(error.message)
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

    if (error) throw new Error(error.message)
    return (data.settings as WorkspaceSetupV1Settings | undefined) ?? {}
  },
}
