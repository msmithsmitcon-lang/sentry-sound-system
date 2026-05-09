import { RolePermissionSet } from "./types";

export const ROLE_PERMISSIONS: RolePermissionSet[] = [
  {
    role: "owner",
    permissions: [
      { resource: "analytics", action: "admin" },
      { resource: "reports", action: "admin" },
      { resource: "workflows", action: "admin" },
      { resource: "approvals", action: "admin" },
      { resource: "royalties", action: "admin" },
      { resource: "rights", action: "admin" },
      { resource: "releases", action: "admin" },
      { resource: "finance", action: "admin" },
      { resource: "contacts", action: "admin" },
      { resource: "assets", action: "admin" },
      { resource: "integrations", action: "admin" },
      { resource: "settings", action: "admin" },
    ],
  },
  {
    role: "admin",
    permissions: [
      { resource: "analytics", action: "execute" },
      { resource: "reports", action: "export" },
      { resource: "workflows", action: "admin" },
      { resource: "approvals", action: "approve" },
      { resource: "royalties", action: "admin" },
      { resource: "rights", action: "admin" },
      { resource: "releases", action: "admin" },
      { resource: "finance", action: "admin" },
      { resource: "contacts", action: "admin" },
      { resource: "assets", action: "admin" },
      { resource: "integrations", action: "admin" },
      { resource: "settings", action: "update" },
    ],
  },
  {
    role: "manager",
    permissions: [
      { resource: "analytics", action: "read" },
      { resource: "reports", action: "export" },
      { resource: "workflows", action: "execute" },
      { resource: "approvals", action: "approve" },
      { resource: "royalties", action: "read" },
      { resource: "rights", action: "read" },
      { resource: "releases", action: "update" },
      { resource: "finance", action: "read" },
      { resource: "contacts", action: "update" },
      { resource: "assets", action: "update" },
    ],
  },
  {
    role: "analyst",
    permissions: [
      { resource: "analytics", action: "read" },
      { resource: "reports", action: "export" },
      { resource: "royalties", action: "read" },
      { resource: "rights", action: "read" },
      { resource: "finance", action: "read" },
    ],
  },
  {
    role: "contributor",
    permissions: [
      { resource: "assets", action: "create" },
      { resource: "assets", action: "read" },
      { resource: "releases", action: "read" },
      { resource: "contacts", action: "read" },
    ],
  },
  {
    role: "viewer",
    permissions: [
      { resource: "analytics", action: "read" },
      { resource: "reports", action: "read" },
      { resource: "royalties", action: "read" },
      { resource: "rights", action: "read" },
      { resource: "releases", action: "read" },
    ],
  },
];
