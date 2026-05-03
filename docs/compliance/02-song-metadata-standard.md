# Song Metadata Standard V1

## Purpose

This document defines the standard metadata that Sentry Sound must capture for every song/work.

The goal is to support:

- catalogue management
- copyright evidence
- SAMRO-style work registration
- CAPASSO-style mechanical rights tracking
- RiSA / ISRC recording tracking
- SAMPRA / neighbouring rights tracking
- licensing
- StudyEdge/API music usage
- future royalty reporting

## Core principle

A song must be separated into:

1. Work / Composition
2. Recording / Master
3. Contributors / Splits
4. Registrations / Compliance
5. Copyright Evidence
6. Usage Tags / API Handles

---

## 1. Work / Composition Fields

- work_title
- alternative_titles
- internal_code
- catalogue_number
- version_label
- language
- lyrics_text
- explicit_status
- genre
- sub_genre
- mood
- themes
- tags

---

## 2. Rights / Contributor Fields

- composer_names
- lyricist_names
- publisher_name
- publisher_share
- composer_split_total
- lyric_split_total
- split_sheet_status

---

## 3. Registration Fields

- samro_work_number
- capasso_work_number
- iswc
- registration_status
- submitted_at
- confirmed_at
- reference_number

---

## 4. Copyright Section

Copyright does not depend only on a system status.

The system must track evidence and workflow status.

### Copyright Status Options

- draft
- evidence_created
- copyright_pack_prepared
- submitted
- acknowledged
- approved
- rejected
- disputed

### Fields

- copyright_status
- copyright_claimant
- copyright_year
- copyright_notice
- copyright_pack_url
- copyright_evidence_notes
- copyright_submitted_at
- copyright_confirmed_at

Example notice:

© 2026 Sentry Sound. All rights reserved.

---

## 5. Usage / API Fields

- api_handle
- usage_tag
- education_subject
- education_grade
- content_theme
- allowed_usage
- license_status
- available_for_api

Example API handles:

- sentry.history.ancient-egypt.intro.001
- sentry.math.focus.calm.001
- sentry.afrikaans.poetry.soft.001

---

## 6. Controlled Genre List V1

- Afro Pop
- Amapiano
- Gospel
- Hip Hop
- Kwaito
- R&B
- Pop
- Rock
- Classical
- Orchestral
- Cinematic
- Ambient
- Educational
- Children
- Corporate
- Documentary
- Traditional
- World
- Electronic
- Other

---

## 7. Build Rule

The database must allow future expansion.

New fields may be added as:
- direct table columns for high-value metadata
- JSON metadata fields for flexible future expansion
- related tables where repeated records are required
