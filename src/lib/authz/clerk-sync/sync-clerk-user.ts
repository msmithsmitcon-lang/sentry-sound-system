import { createClient } from "@/lib/supabase/server";
import { getCurrentClerkUser } from "@/lib/authz/get-current-clerk-user";

export async function syncCurrentClerkUserToWorkspace() {
  const user = await getCurrentClerkUser();

  if (!user) {
    throw new Error("No authenticated Clerk user found.");
  }

  const supabase = await createClient();

  const { error: profileError } = await supabase
    .from("user_profiles")
    .upsert(
      {
        clerk_user_id: user.clerkUserId,
        primary_email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        status: "active",
      },
      { onConflict: "clerk_user_id" }
    );

  if (profileError) {
    throw new Error(`Profile sync failed: ${profileError.message}`);
  }

  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .select("*")
    .eq("name", "Sentry Sound Demo Workspace")
    .single();

  if (workspaceError || !workspace) {
    throw new Error(`Workspace lookup failed: ${workspaceError?.message}`);
  }

  const { data: ownerRole, error: roleError } = await supabase
    .from("rbac_roles")
    .select("*")
    .eq("role_key", "owner")
    .single();

  if (roleError || !ownerRole) {
    throw new Error("Owner role not found. Run RBAC seed first.");
  }

  const { error: roleAssignError } = await supabase
    .from("workspace_user_roles")
    .upsert(
      {
        workspace_id: workspace.id,
        user_id: user.clerkUserId,
        role_id: ownerRole.id,
      },
      { onConflict: "workspace_id,user_id,role_id" }
    );

  if (roleAssignError) {
    throw new Error(`Role assignment failed: ${roleAssignError.message}`);
  }

  return {
    user,
    workspace,
    role: ownerRole.role_key,
  };
}
