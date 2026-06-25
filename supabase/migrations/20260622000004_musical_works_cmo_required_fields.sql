-- Adds fields required for CMO Submission Ready Pack validation
-- (PLEXICON_MASTER_EXECUTION_BRIEF_V1.md Part 11 Step 2 / Phase 3).
--
-- The live musical_works table had no iswc, language, or duration
-- columns at all prior to this migration — confirmed by exhaustive
-- search across every tracked SQL file. The CMO pack generator's
-- required-field validation (ISWC if known, language, duration) has
-- nothing to check without these.

ALTER TABLE public.musical_works
  ADD COLUMN IF NOT EXISTS iswc text,
  ADD COLUMN IF NOT EXISTS language text,
  ADD COLUMN IF NOT EXISTS duration_seconds integer;
