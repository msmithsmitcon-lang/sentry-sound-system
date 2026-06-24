-- Music Genre Enum, BPM, and Musical Key Migration
--
-- Implements PLEXICON_MASTER_EXECUTION_BRIEF_V1.md Part 5 (canonical Music
-- Domain Pack genre taxonomy) and Part 11 Step 2 (Sentry Sound V1
-- completion).
--
-- Existing free-text genre values are preserved verbatim in
-- genre_legacy_text before any mutation, then normalized into the new
-- enum column. No data is silently discarded; unrecognized values become
-- NULL rather than being guessed at. 'Pop' (not a canonical genre) is
-- explicitly mapped to 'Other'.

-- 1. New audio metadata columns
ALTER TABLE public.musical_works
  ADD COLUMN IF NOT EXISTS bpm integer,
  ADD COLUMN IF NOT EXISTS musical_key text;

-- 2. Preserve existing free-text genre values before any mutation
ALTER TABLE public.musical_works
  ADD COLUMN IF NOT EXISTS genre_legacy_text text;

UPDATE public.musical_works
  SET genre_legacy_text = genre
  WHERE genre_legacy_text IS NULL;

-- 3. Create the canonical enum type
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'music_genre') THEN
    CREATE TYPE public.music_genre AS ENUM (
      'Amapiano',
      'Afrobeats/Afropop',
      'Hip-Hop/Rap',
      'House',
      'Gqom',
      'Kwaito',
      'Gospel',
      'R&B/Soul',
      'Jazz',
      'Folk/Acoustic',
      'Classical/Orchestral',
      'Rock',
      'Electronic/EDM',
      'Spoken Word',
      'Other'
    );
  END IF;
END $$;

-- 4. New enum-typed column, populated by explicit normalization
ALTER TABLE public.musical_works
  ADD COLUMN IF NOT EXISTS genre_normalized public.music_genre;

UPDATE public.musical_works
SET genre_normalized = CASE lower(trim(coalesce(genre, '')))
  WHEN 'amapiano'              THEN 'Amapiano'
  WHEN 'afrobeats'             THEN 'Afrobeats/Afropop'
  WHEN 'afrobeats/afropop'     THEN 'Afrobeats/Afropop'
  WHEN 'afropop'               THEN 'Afrobeats/Afropop'
  WHEN 'hip hop'               THEN 'Hip-Hop/Rap'
  WHEN 'hip-hop'               THEN 'Hip-Hop/Rap'
  WHEN 'rap'                   THEN 'Hip-Hop/Rap'
  WHEN 'hip-hop/rap'           THEN 'Hip-Hop/Rap'
  WHEN 'house'                 THEN 'House'
  WHEN 'gqom'                  THEN 'Gqom'
  WHEN 'kwaito'                THEN 'Kwaito'
  WHEN 'gospel'                THEN 'Gospel'
  WHEN 'r&b'                   THEN 'R&B/Soul'
  WHEN 'rnb'                   THEN 'R&B/Soul'
  WHEN 'soul'                  THEN 'R&B/Soul'
  WHEN 'r&b/soul'              THEN 'R&B/Soul'
  WHEN 'jazz'                  THEN 'Jazz'
  WHEN 'folk'                  THEN 'Folk/Acoustic'
  WHEN 'acoustic'              THEN 'Folk/Acoustic'
  WHEN 'folk/acoustic'         THEN 'Folk/Acoustic'
  WHEN 'classical'             THEN 'Classical/Orchestral'
  WHEN 'orchestral'            THEN 'Classical/Orchestral'
  WHEN 'classical/orchestral'  THEN 'Classical/Orchestral'
  WHEN 'rock'                  THEN 'Rock'
  WHEN 'electronic'            THEN 'Electronic/EDM'
  WHEN 'edm'                   THEN 'Electronic/EDM'
  WHEN 'electronic/edm'        THEN 'Electronic/EDM'
  WHEN 'spoken word'           THEN 'Spoken Word'
  WHEN 'pop'                   THEN 'Other'
  WHEN 'other'                 THEN 'Other'
  WHEN ''                      THEN NULL
  ELSE NULL
END::public.music_genre;

-- 5. Swap the columns: drop old free-text genre, promote the normalized one
ALTER TABLE public.musical_works DROP COLUMN genre;
ALTER TABLE public.musical_works RENAME COLUMN genre_normalized TO genre;

-- 6. Update the canonical RPC to use the enum-typed genre column and
--    accept bpm/musical_key. Mirrored in
--    sql/platform/rpc_create_song_with_contributors.sql — keep both in sync.
CREATE OR REPLACE FUNCTION public.rpc_create_song_with_contributors(payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_asset_id uuid;
  v_work_id uuid;
  v_contributor jsonb;
  v_contributor_id uuid;
  v_contributor_count integer := 0;
  v_workspace_id uuid;
  v_created_by_user_id text;
  v_genre public.music_genre;
BEGIN
  v_workspace_id := nullif(payload ->> 'workspace_id', '')::uuid;
  v_created_by_user_id := nullif(payload ->> 'created_by_user_id', '');

  IF v_workspace_id IS NULL THEN
    RAISE EXCEPTION 'workspace_id is required';
  END IF;

  IF v_created_by_user_id IS NULL THEN
    RAISE EXCEPTION 'created_by_user_id is required';
  END IF;

  -- Lenient genre cast: invalid/unmapped values become NULL rather than
  -- hard-failing song creation, to tolerate any stale frontend bundle
  -- during rollout. Deliberate choice, not a silent default — see
  -- BUILD-LOG entry for this migration.
  BEGIN
    v_genre := nullif(payload ->> 'genre', '')::public.music_genre;
  EXCEPTION WHEN invalid_text_representation THEN
    v_genre := NULL;
  END;

  INSERT INTO public.assets (
    workspace_id,
    created_by_user_id,
    title,
    asset_type
  )
  VALUES (
    v_workspace_id,
    v_created_by_user_id,
    payload ->> 'work_title',
    'music'
  )
  RETURNING id INTO v_asset_id;

  INSERT INTO public.musical_works (
    workspace_id,
    created_by_user_id,
    asset_id,
    work_title,
    genre,
    mood,
    bpm,
    musical_key,
    copyright_status,
    registration_status
  )
  VALUES (
    v_workspace_id,
    v_created_by_user_id,
    v_asset_id,
    payload ->> 'work_title',
    v_genre,
    payload ->> 'mood',
    nullif(payload ->> 'bpm', '')::integer,
    payload ->> 'musical_key',
    coalesce(payload ->> 'copyright_status', 'draft'),
    coalesce(payload ->> 'registration_status', 'draft')
  )
  RETURNING id INTO v_work_id;

  FOR v_contributor IN
    SELECT * FROM jsonb_array_elements(coalesce(payload -> 'contributors', '[]'::jsonb))
  LOOP
    v_contributor_count := v_contributor_count + 1;

    IF nullif(v_contributor ->> 'contributor_id', '') IS NOT NULL THEN
      SELECT id
      INTO v_contributor_id
      FROM public.contributors
      WHERE id = (v_contributor ->> 'contributor_id')::uuid
        AND workspace_id = v_workspace_id
      LIMIT 1;

      IF v_contributor_id IS NULL THEN
        RAISE EXCEPTION 'Contributor does not belong to this workspace';
      END IF;
    ELSE
      SELECT id
      INTO v_contributor_id
      FROM public.contributors
      WHERE lower(full_name) = lower(v_contributor ->> 'name')
        AND workspace_id = v_workspace_id
      LIMIT 1;

      IF v_contributor_id IS NULL THEN
        INSERT INTO public.contributors (
          workspace_id,
          created_by_user_id,
          full_name,
          stage_name,
          role,
          contributor_type
        )
        VALUES (
          v_workspace_id,
          v_created_by_user_id,
          v_contributor ->> 'name',
          v_contributor ->> 'name',
          coalesce(v_contributor ->> 'role', 'composer'),
          'person'
        )
        RETURNING id INTO v_contributor_id;
      END IF;
    END IF;

    INSERT INTO public.work_contributors (
      workspace_id,
      created_by_user_id,
      work_id,
      contributor_id,
      role,
      split_type,
      percentage,
      confirmed
    )
    VALUES (
      v_workspace_id,
      v_created_by_user_id,
      v_work_id,
      v_contributor_id,
      coalesce(v_contributor ->> 'role', 'composer'),
      coalesce(v_contributor ->> 'split_type', 'composition'),
      coalesce((v_contributor ->> 'percentage')::numeric, 0),
      false
    );
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'asset_id', v_asset_id,
    'work_id', v_work_id,
    'workspace_id', v_workspace_id,
    'contributor_count', v_contributor_count
  );
END;
$function$;
