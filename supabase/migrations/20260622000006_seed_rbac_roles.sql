-- Seed rbac_roles with the roles ROLE_PERMISSIONS (src/lib/rbac/permissions.ts)
-- actually references. rbac_roles was created by
-- 20260508103000_create_rbac_foundation.sql but never seeded — new-user
-- onboarding (sync-clerk-user.ts) looks up role_key = 'owner' and was
-- failing because no role rows existed at all.

insert into rbac_roles (role_key, display_name, description, is_system_role)
values
  ('owner', 'Owner', 'Full administrative control over the workspace.', true),
  ('admin', 'Admin', 'Broad administrative access across workspace modules.', true),
  ('manager', 'Manager', 'Operational access to manage day-to-day workspace activity.', true),
  ('analyst', 'Analyst', 'Read access to analytics, reporting, and finance data.', true),
  ('contributor', 'Contributor', 'Can create and read assets and releases.', true),
  ('viewer', 'Viewer', 'Read-only access to workspace data.', true)
on conflict (role_key) do nothing;
