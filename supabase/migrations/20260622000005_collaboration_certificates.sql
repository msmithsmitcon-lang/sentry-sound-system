-- Proof-of-Collaboration Certificates
--
-- PLEXICON_MASTER_EXECUTION_BRIEF_V1.md Part 11 Step 2 / Phase 4 — Session
-- Producer/Beatmaker journey: "generate timestamped proof-of-collaboration
-- certificate -> share before handing over stems."
--
-- verification_id is the public lookup key (used in /verify/[id] and
-- /api/verify/[id]) — distinct from the internal primary key so internal
-- IDs are never exposed publicly.

CREATE TABLE IF NOT EXISTS public.collaboration_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_id uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),

  workspace_id uuid NOT NULL,
  work_id uuid NOT NULL,

  work_title text NOT NULL,

  -- Snapshot of contributors at generation time — deliberately denormalized
  -- (not a live join) so a later contributor edit cannot silently alter
  -- what a previously-issued certificate attests to.
  contributors jsonb NOT NULL,

  audio_file_checksum text,
  audio_file_checksum_algorithm text DEFAULT 'sha256',

  legal_basis text NOT NULL DEFAULT 'Electronic Communications and Transactions Act 25 of 2002',

  generated_by_user_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_collaboration_certificates_work
  ON public.collaboration_certificates(work_id, workspace_id);

CREATE INDEX IF NOT EXISTS idx_collaboration_certificates_verification_id
  ON public.collaboration_certificates(verification_id);
