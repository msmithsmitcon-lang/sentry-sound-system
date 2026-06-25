# TEST ENVIRONMENT RULES (LOCKED)

## Mode
System runs ONLY in TEST MODE during development.

## Data Rules
- Only use MusicalWork IDs returned from controlled queries
- No manual UUID guessing
- No cross-context IDs
- No production/live assumptions

## Source of Truth
- MusicalWork
- MusicalWorkContributor
- SubmissionQueue

## Allowed Workflow
1. Fetch valid test work
2. Run readiness check
3. Create submission
4. Update status (test only)

## Forbidden
- Mixing environments
- Using random IDs
- Assuming production parity

## Purpose
Prevent drift between:
- test data
- runtime API data
- database state

This ensures deterministic development and repeatable tests.
