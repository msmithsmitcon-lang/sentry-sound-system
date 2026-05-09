# RBAC / Authorization Module

## Purpose

Provides enterprise permission governance for Sentry Sound.

## Current Status

Implemented:

- RBAC role registry
- Permission registry
- Role-permission mapping
- Workspace user role assignments
- Seed automation
- Runtime permission matrix
- Permission checker
- Reusable authorization gate
- Protected analytics execution route

## Architecture

RBAC supports:

- Workspace-scoped access control
- Modular resource/action permissions
- Governance over analytics, workflows, approvals, finance, royalties, releases, rights, assets, integrations, and settings
- Future Clerk integration
- Future audit logging for authorization checks

## Protected Route Added

`POST /api/analytics/execute-report`

Required permission:

`analytics.execute`

## Notes

This module is part of the governance layer and must remain separate from workflow, analytics, finance, and rights business logic.
