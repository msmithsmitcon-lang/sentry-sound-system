# Separation from StudyEdge

Sentry Sound and StudyEdge are separate systems.

## Rule 1: No shared database
Sentry Sound has its own Supabase project, storage, users, and infrastructure.

## Rule 2: No shared ownership by default
Sentry Sound owns music assets.
StudyEdge owns education assets.

## Rule 3: Only API linkage
StudyEdge may request approved music through a controlled API.

## Rule 4: Contract governs usage
All StudyEdge use of Sentry Sound music must be backed by a licence agreement.

## Rule 5: Usage must be logged
Every StudyEdge music request should create a usage log in Sentry Sound.

## Rule 6: Future sale protection
Either company must be sellable independently without database separation problems.
