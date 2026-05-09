
# SAMRO Compliance Gate V2

## Purpose

SAMRO Compliance Gate V2 ensures that submissions are normalized, validated, deduplicated, fingerprinted, persisted, and queued deterministically before regulator processing.

## Validation Layers

- Ownership total must equal 100%.
- Contributor IPI must be valid when supplied.
- Publisher IPI must be valid when supplied.
- Contributor role must be supported.
- Territory must be supported.
- Duplicate contributors are blocked.

## Normalization

Normalization occurs before validation and fingerprinting.

Normalized fields include:

- work title
- alternate title
- language
- ISWC
- contributor name
- contributor legal name
- contributor alias
- contributor IPI
- contributor role
- publisher name
- publisher IPI
- territory

## Deterministic Export Guarantees

- CSV is generated after normalization.
- Fingerprint is generated from the normalized CSV.
- Existing immutable snapshots are reused.
- Existing active queue items are reused.
- Duplicate active submissions are prevented.

## Backend Boundary

This is backend infrastructure only.

User-facing form design, practical intake fields, and UI mapping are deferred to a later dedicated phase.

## Next Phase

Regulator Response Ingestion V1.

