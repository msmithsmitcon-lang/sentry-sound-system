-- Minimal persisted log for Music Domain Pack events emitted by Sentry
-- Sound into Plexicon Core, per PLEXICON_MASTER_EXECUTION_BRIEF_V1.md
-- Part 11 Step 2 ("Music Domain Pack events emitted from Sentry Sound to
-- Plexicon Core").
--
-- This is a deliberately minimal local log, not a real cross-repo event
-- bus — Plexicon's own Integration Layer is listed as OUTSTANDING in
-- PLEXICON_ENTERPRISE_GAPS_AND_OUTSTANDING_LAYERS_V1.md, so there is no
-- live transport into plexicon-contracts yet. Events are persisted here
-- in the exact canonical payload shape (matching the
-- plexicon.domain.music.*.v1 contracts built in plexicon-contracts) so
-- they are replay-safe and exportable once real transport exists.

CREATE TABLE IF NOT EXISTS public.plexicon_domain_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid,
  event_type text NOT NULL,
  event_version text NOT NULL DEFAULT 'v1',
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_plexicon_domain_events_type
  ON public.plexicon_domain_events(event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_plexicon_domain_events_workspace
  ON public.plexicon_domain_events(workspace_id);
