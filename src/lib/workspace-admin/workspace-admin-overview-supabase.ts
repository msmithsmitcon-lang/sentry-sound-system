import { workspaceSubscriptionAdminSupabaseRepository } from "@/lib/entitlements/workspace-subscription-admin-supabase"
import { workspaceOnboardingAdminSupabaseRepository } from "@/lib/workspace-onboarding/workspace-onboarding-admin-supabase"

import { WorkspaceAdminOverviewRepositories } from "./workspace-admin-overview"

export const workspaceAdminOverviewSupabaseRepositories: WorkspaceAdminOverviewRepositories =
  {
    onboarding: workspaceOnboardingAdminSupabaseRepository,
    subscription: workspaceSubscriptionAdminSupabaseRepository,
  }
