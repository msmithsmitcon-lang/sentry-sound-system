-- Royalty Statement Clarity V1 — first vertical slice of the Royalty
-- Intelligence Service. Promise: "You will never be left wondering what
-- is happening with your royalties."
--
-- musical_works has no isrc column at all (only iswc, for compositions —
-- ISRC belongs to recordings, which don't exist as a real table in this
-- schema). The parser's ISRC-first matching strategy needs a real column
-- to match against, so adding it here, additively, alongside the two new
-- tables this migration exists for.

ALTER TABLE public.musical_works
  ADD COLUMN IF NOT EXISTS isrc text;

CREATE INDEX IF NOT EXISTS idx_musical_works_isrc
  ON public.musical_works(isrc)
  WHERE isrc IS NOT NULL;

CREATE TABLE public.royalty_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id),
  source_name text NOT NULL,
  upload_date timestamptz NOT NULL DEFAULT now(),
  period_start date,
  period_end date,
  total_amount numeric(12,2),
  currency text NOT NULL DEFAULT 'ZAR',
  status text NOT NULL DEFAULT 'processing'
    CHECK (status IN ('processing', 'matched', 'needs_attention', 'complete')),
  raw_filename text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_royalty_statements_workspace_id
  ON public.royalty_statements(workspace_id);

CREATE TABLE public.royalty_statement_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  statement_id uuid NOT NULL REFERENCES public.royalty_statements(id) ON DELETE CASCADE,
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id),
  raw_title text NOT NULL,
  raw_artist text,
  raw_amount numeric(12,2) NOT NULL DEFAULT 0,
  raw_isrc text,
  matched_work_id uuid REFERENCES public.musical_works(id) ON DELETE SET NULL,
  match_status text NOT NULL DEFAULT 'unmatched'
    CHECK (match_status IN ('matched', 'unmatched', 'partial')),
  attention_reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_royalty_statement_lines_statement_id
  ON public.royalty_statement_lines(statement_id);

CREATE INDEX idx_royalty_statement_lines_workspace_id
  ON public.royalty_statement_lines(workspace_id);

CREATE INDEX idx_royalty_statement_lines_matched_work_id
  ON public.royalty_statement_lines(matched_work_id);
