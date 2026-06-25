# Deployment Topology V1

Date: 2026-05-25

Status: Canonical deployment governance decision

## 1. Canonical Runtime Decision

`sentry-sound-system` is the only canonical Vercel deployment and runtime target for the current phase.

No separate MWIS Vercel application, deployment root, runtime target, or production project should be created at this stage.

Any future runtime split requires an explicit governance decision before repository changes, Vercel configuration, Cloudflare routing, or DNS changes are made.

## 2. System Relationship

The current platform relationship is:

- Plexicon: parent doctrine, semantic authority, and orchestration intelligence layer
- Sentry Sound: canonical music SaaS and runtime deployment
- MWIS: artist/project/campaign governance use case inside Sentry Sound, not a separate runtime

MWIS materials may contain useful campaign governance doctrine, source-of-truth structures, campaign lifecycle logic, approval governance, asset/caption/platform readiness, and operational tracking patterns.

Those materials must be treated as future import/reference doctrine until explicitly integrated into Sentry Sound through governed implementation work.

## 3. Domain Direction

The intended public and app domain topology is:

- `sentrysound.co.za`: public website
- `www.sentrysound.co.za`: redirect or alias to the public website
- `app.sentrysound.co.za`: authenticated SaaS and app runtime
- `mwis.sentrysound.co.za`: optional future protected/project surface, not active now

`mwis.sentrysound.co.za` must not be configured until the product/runtime governance decision changes.

## 4. Provider Responsibilities

Current provider responsibilities are:

- 1-grid/Plesk: domain registration, email/mailboxes, and fallback hosting only
- Cloudflare: DNS, SSL, and routing control
- Vercel: Sentry Sound app/platform hosting

1-grid/Plesk must not become the canonical app runtime unless an explicit fallback or migration decision is made.

Cloudflare should control DNS and SSL routing before production domain execution.

Vercel should host the canonical `sentry-sound-system` app only.

## 5. Repository Boundary

The `sentry-sound-system` repository remains the deployment root for the canonical app.

MWIS files, exports, chat artifacts, campaign documents, or lifecycle structures must not be copied into a separate app root or used to bootstrap a separate Vercel deployment.

Future MWIS-derived work should enter this repository as governed platform capability, for example:

- campaign governance reference doctrine
- project/campaign lifecycle models
- approval and readiness workflows
- asset, caption, and platform readiness logic
- operational tracking patterns

Those imports must be scoped, documented, tested, and aligned with Sentry Sound platform architecture before runtime exposure.

## 6. Pre-Deployment Non-Actions

Until deployment execution is explicitly approved:

- Do not connect Vercel.
- Do not change DNS.
- Do not configure Cloudflare records.
- Do not create a separate MWIS app.
- Do not refactor runtime architecture for MWIS.
- Do not treat MWIS as a deployment root.

## 7. Current Deploy Readiness Snapshot

As of 2026-05-25, production build verification was attempted with:

```powershell
npm.cmd run build
```

Observed result:

- Next.js production compilation completed successfully.
- TypeScript validation failed.
- Blocking error: `app/api/finance/alerts/route.ts` reports that `accounts` is possibly `null`.
- The repository is not deployment-ready until type-checking passes.

PowerShell direct `npm run build` is blocked on this machine by script execution policy, so the Windows command shim `npm.cmd` should be used for local verification.

## 8. Deployment Readiness Criteria

Before Vercel or Cloudflare execution, the repository should satisfy:

- canonical deployment topology documented and accepted
- `npm.cmd run build` passes
- required production environment variables identified
- Vercel project target confirmed as `sentry-sound-system`
- no separate MWIS deployment target created
- Cloudflare DNS plan reviewed before records change
- public website and authenticated app domain responsibilities confirmed

## 9. Authority Rule

This document governs deployment topology until replaced by a later signed-off deployment topology decision.

Runtime, DNS, hosting, and MWIS-related deployment choices must align to this document.
