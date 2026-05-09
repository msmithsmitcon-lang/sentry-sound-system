import { SystemRole } from "./types";

export const SYSTEM_ROLES: SystemRole[] = [
  "owner",
  "admin",
  "manager",
  "analyst",
  "contributor",
  "viewer",
];

export function isSystemRole(value: string): value is SystemRole {
  return SYSTEM_ROLES.includes(value as SystemRole);
}
