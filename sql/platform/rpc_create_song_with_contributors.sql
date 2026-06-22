-- Source of truth: mirrors supabase/migrations/20260520090000
-- Updated: 2026-06-21 — workspace-scoped version

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
BEGIN
  v_workspace_id := nullif(payload ->> 'workspace_id', '')::uuid;
  v_created_by_user_id := nullif(payload ->> 'created_by_user_id', '');

  IF v_workspace_id IS NULL THEN
    RAISE EXCEPTION 'workspace_id is required';
  END IF;

  IF v_created_by_user_id IS NULL THEN
    RAISE EXCEPTION 'created_by_user_id is required';
  END IF;

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
    copyright_status,
    registration_status
  )
  VALUES (
    v_workspace_id,
    v_created_by_user_id,
    v_asset_id,
    payload ->> 'work_title',
    payload ->> 'genre',
    payload ->> 'mood',
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
