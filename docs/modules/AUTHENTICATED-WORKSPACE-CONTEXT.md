# Authenticated Workspace Context

## Purpose

Provides the universal backend context resolver for authenticated Sentry Sound users.

## Current Status

Implemented:

- Clerk authenticated user resolution
- User profile sync
- Workspace membership sync
- RBAC role resolution
- Effective permission resolution
- Backend test endpoint

## Context Flow

Clerk session
→ Clerk user
→ user_profiles
→ workspace_user_roles
→ workspaces
→ rbac_roles
→ effective permissions

## Test Endpoint

`GET /api/workspace-context/me`

Returns:

- authenticated user
- active workspace
- assigned role
- effective permissions

## Strategic Use

This context resolver should be used by:

- dashboards
- analytics
- finance
- royalties
- rights lifecycle
- approvals
- workflows
- notifications
- file vault
- integrations
- future AI orchestration

## Architecture Rule

Business modules should not directly re-resolve Clerk identity.

They should consume authenticated workspace context where possible.
