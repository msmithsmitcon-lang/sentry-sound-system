
# Registration Submission Engine

## Purpose

The Submission Engine manages regulator-oriented submission orchestration for Sentry Sound.

It supports deterministic processing for:

- SAMRO
- CAPASSO
- SAMPRA
- RAV
- DDEX
- CWR
- Vericast

## Current V1 Capabilities

- submission lifecycle states
- queue persistence
- queue event persistence
- retry governance
- regulator adapter abstraction
- SAMRO adapter stub
- deterministic processing service
- cloud Supabase persistence
- test runner validation

## Architectural Rule

The engine does not replace the royalty engine.

It sits before royalty processing:

Compliance / Registration
? Submission Engine
? Regulator Response
? Royalty Eligibility Gate
? Royalty Engine
? Finance ERP

## Security Note

All current development secrets and database credentials must be rotated before production or real data use.

## Next Phase

Real SAMRO CSV/export foundation.

