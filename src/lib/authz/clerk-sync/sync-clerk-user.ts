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

  // Does this user already have a workspace? Defensive check — this
  // function is also called directly from the sync-me / sync-me-browser-test
  // API routes, not just via the no-workspace-yet fallback in
  // get-authenticated-workspace-context.ts, so it must be safe to call even
  // when a workspace already exists.
  const { data: existing, error: existingError } = await supabase
    .from("workspace_user_roles")
    .select("workspace_id, workspaces(*), rbac_roles(role_key)")
    .eq("user_id", user.clerkUserId)
    .limit(1)
    .maybeSingle();

  if (existingError) {
    throw new Error(`Existing workspace lookup failed: ${existingError.message}`);
  }

  if (existing) {
    const workspace = Array.isArray(existing.workspaces) ? existing.workspaces[0] : existing.workspaces;
    const role = Array.isArray(existing.rbac_roles) ? existing.rbac_roles[0] : existing.rbac_roles;
    if (!workspace || !role) {
      throw new Error("Existing workspace link is incomplete for this user.");
    }
    return { user, workspace, role: role.role_key };
  }

  // Find the owner role by name — never assume it exists without checking.
  const { data: ownerRole, error: roleError } = await supabase
    .from("rbac_roles")
    .select("*")
    .eq("role_key", "owner")
    .maybeSingle();

  if (roleError) {
    throw new Error(`Owner role lookup failed: ${roleError.message}`);
  }
  if (!ownerRole) {
    throw new Error("Owner role not found. Run the rbac_roles seed migration first.");
  }

  // No workspace yet — create one for this specific user. Never a
  // hardcoded shared workspace name again.
  const workspaceName = user.firstName ? `${user.firstName}'s Music Business` : "Your Music Business";

  const { data: newWorkspace, error: createWorkspaceError } = await supabase
    .from("workspaces")
    .insert({ name: workspaceName })
    .select("*")
    .single();

  if (createWorkspaceError || !newWorkspace) {
    throw new Error(`Workspace creation failed: ${createWorkspaceError?.message}`);
  }

  // Link the new user to their new workspace as owner.
  const { error: roleAssignError } = await supabase
    .from("workspace_user_roles")
    .upsert(
      {
        workspace_id: newWorkspace.id,
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
    workspace: newWorkspace,
    role: ownerRole.role_key,
  };
}
