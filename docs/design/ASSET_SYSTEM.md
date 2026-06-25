# Asset System Direction

## Status

Early compatibility and memory foundation. Not a full asset platform.

## Principle

Assets are assets.

Figma may become a future editing surface, but it is not automatically the source of truth.

The long-term value is reusable operational design memory:

- workflow assets
- layout fragments
- interaction patterns
- visual language
- semantic UI components
- public/private asset posture
- retrieval-compatible references

## Asset Types

Future reusable assets may include:

- UI sections
- dashboard cards
- right-rail panels
- workflow steppers
- form groups
- empty states
- status badges
- help/tips blocks
- upload zones
- public-safe media candidates
- icon usage conventions
- visual direction references

## Lightweight Registry Direction

The asset system should begin as documentation and small registries, not a platform.

Suggested early locations:

- `docs/design/assets/`
- `src/ui/patterns/`
- `src/ui/templates/`
- `src/ui/assets/`

The registry should capture:

- name
- purpose
- where it is used
- product context
- public/private posture if relevant
- reuse notes
- implementation source

## Retrieval Direction

Future retrieval should prefer approved/reusable patterns before generating new UI from scratch.

Expected retrieval flow later:

1. identify workflow need
2. search local pattern/asset memory
3. reuse or adapt a known pattern
4. document new reusable pattern if it emerges

## Boundaries

Do not build a full DAM now.

Do not create token-system bureaucracy now.

Do not treat screenshots as source-of-truth.

Do not make public visibility decisions from visual design alone.

Backend and operational contracts remain authoritative.

