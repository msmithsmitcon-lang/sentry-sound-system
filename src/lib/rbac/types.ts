export type PermissionAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "approve"
  | "execute"
  | "export"
  | "admin";

export type PermissionResource =
  | "analytics"
  | "reports"
  | "workflows"
  | "approvals"
  | "royalties"
  | "rights"
  | "releases"
  | "finance"
  | "contacts"
  | "assets"
  | "integrations"
  | "settings";

export type SystemRole =
  | "owner"
  | "admin"
  | "manager"
  | "analyst"
  | "contributor"
  | "viewer";

export interface Permission {
  resource: PermissionResource;
  action: PermissionAction;
}

export interface RolePermissionSet {
  role: SystemRole;
  permissions: Permission[];
}

export interface CheckPermissionInput {
  role: SystemRole;
  resource: PermissionResource;
  action: PermissionAction;
}
