import { syncCurrentClerkUserToWorkspace } from "@/lib/authz/clerk-sync/sync-clerk-user";

export async function bootstrapAuthenticatedUser() {
  const result = await syncCurrentClerkUserToWorkspace();

  return {
    success: true,
    onboardingCompleted: true,
    workspaceId: result.workspace.id,
    role: result.role,
    user: result.user,
  };
}
