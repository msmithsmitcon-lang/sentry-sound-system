# UI Change Workflow

## Purpose

Canonical frontend/UI modification workflow for landing pages, portals, dashboards, and future SaaS interfaces.

This workflow exists to:
- prevent frontend drift
- avoid full page rewrites
- preserve design consistency
- enable safe AI/Codex collaboration
- support token-driven frontend governance
- standardize inspect -> identify -> patch workflow
- ensure AI visual mockups are treated as direction, not executable UI systems

---

# AI Visual Mockup Rule

AI-generated UI mockups are Visual Direction Artifacts, not executable UI systems.

Validated production pipeline:

Visual Direction Artifact
->
AI Visual Extraction
->
Production Asset Pack
->
Codex Asset Integration
->
Executable frontend system

Use AI visuals for:
- UX direction
- emotional tone
- hierarchy
- premium feel
- product intuition
- stakeholder alignment

Do NOT treat AI visuals as:
- component architecture
- frontend truth
- reusable assets
- final layout systems
- executable design systems

Before implementing from an AI mockup, screenshot, or annotated visual, perform AI Visual Extraction:

1. Extract layout hierarchy.
2. Extract spacing and density.
3. Extract UX intent and product priority.
4. Extract tone and interaction feel.
5. Identify what is primary, secondary, quiet, hidden, or removed.
6. Decide whether a Production Asset Pack is required.
7. Generate, collect, or approve standalone reusable assets separately from the flattened AI visual.
8. Separate real reusable assets into `/public/assets` or the current approved asset structure.
9. Build executable UI through existing Next.js/Tailwind components and local app patterns.
10. Keep backend/source-of-truth and operational workflow logic authoritative.

The visual is direction. The codebase remains the implementation authority.

Do not:
- extract assets from flattened AI images
- treat screenshots as frontend architecture
- treat mockup pixels as component truth
- let cinematic visuals override SaaS usability
- let Plexicon doctrine dominate UX execution

Preferred production asset folders:

```text
public/assets/
  branding/
  hero/
  catalogue/
  icons/
  textures/
```

---

# Canonical Frontend Structure

## Theme Tokens

File:
app/landing/landing-theme.ts

Controls:
- colors
- typography
- spacing
- shadows
- borders
- reusable button styles
- reusable card styles

This is the canonical styling layer.

Do NOT hardcode repeated styling directly inside page.tsx unless unavoidable.

---

## Content Layer

File:
app/landing/landing-content.ts

Controls:
- wording
- CTA labels
- feature cards
- icons
- section text
- footer text

This is the canonical content layer.

---

## Layout Layer

File:
app/landing/page.tsx

Controls:
- page structure
- section ordering
- component placement
- rendering logic

This file should remain thin.

Avoid embedding large repeated styling definitions here.

---

# Canonical UI Update Workflow

## Step 1 — Identify Element

Use browser DevTools:

Right Click -> Inspect

Identify:
- exact button
- card
- heading
- section
- token
- className

Preferred format:

SECTION -> ELEMENT -> CHANGE

Examples:
- Hero -> Primary button -> background color
- Navbar -> CTA button -> text color
- Features -> Cards -> border radius

---

## Step 2 — Determine Scope

### Global Change
Update shared token:
- t.primaryButton
- t.card
- t.h1
- t.body
- t.badge

### Local Change
Patch only the specific JSX element.

---

## Step 3 — Apply Changes Via PowerShell

Preferred workflow:
- PowerShell patch
- token updates
- controlled replacements

Avoid:
- rewriting entire pages
- manual uncontrolled edits
- duplicated styles

---

## Step 4 — If A Visual Mockup Is Involved

Do not copy the mockup as a layout system.

Convert it into an implementation note:
- what the user is trying to do
- what content should lead the screen
- what should move to support/secondary areas
- what labels should become simpler or more product-first
- what backend/state logic must remain unchanged
- which existing routes/data/components must be preserved

If real visual assets are needed, create a Production Asset Pack before implementation:
- `public/assets/branding/` for marks, logos, and brand devices
- `public/assets/hero/` for hero media
- `public/assets/catalogue/` for product/catalogue imagery
- `public/assets/icons/` for standalone icons not covered by the icon library
- `public/assets/textures/` for reusable texture/background assets

Codex may integrate approved assets, but the mockup itself is not an asset source.

Then patch the smallest practical surface.

---

# Design Governance Rules

## Never:
- rebuild full page for small style changes
- duplicate colors repeatedly
- create isolated styling systems
- mix unrelated themes

## Always:
- use shared theme tokens
- centralize reusable styles
- inspect before patching
- isolate layout/content/theme responsibilities

---

# Long-Term Direction

Future structure:

app/landing/components/
- Hero.tsx
- Navbar.tsx
- FeatureGrid.tsx
- CTASection.tsx

This supports scalable SaaS frontend governance.

---

# Canonical Workflow Summary

Inspect -> Identify -> Extract Visual Direction if applicable -> Prepare Production Asset Pack if needed -> Token or Element -> PowerShell Patch -> Refresh

This workflow is now the canonical frontend operating model for Sentry Sound and future governed SaaS systems.
