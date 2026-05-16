create or replace function public.rpc_create_song_with_contributors(
  payload jsonb
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_asset_id uuid;
  v_work_id uuid;
  v_contributor jsonb;
  v_contributor_id uuid;
  v_contributor_count integer := 0;
begin
  insert into public.assets (
    title,
    asset_type
  )
  values (
    payload ->> 'work_title',
    'music'
  )
  returning id into v_asset_id;

  insert into public.musical_works (
    asset_id,
    work_title,
    genre,
    mood,
    copyright_status,
    registration_status
  )
  values (
    v_asset_id,
    payload ->> 'work_title',
    payload ->> 'genre',
    payload ->> 'mood',
    coalesce(payload ->> 'copyright_status', 'draft'),
    coalesce(payload ->> 'registration_status', 'draft')
  )
  returning id into v_work_id;

  for v_contributor in
    select * from jsonb_array_elements(
      coalesce(payload -> 'contributors', '[]'::jsonb)
    )
  loop
    v_contributor_count := v_contributor_count + 1;

    if nullif(v_contributor ->> 'contributor_id', '') is not null then
      v_contributor_id := (v_contributor ->> 'contributor_id')::uuid;
    else
      select id
      into v_contributor_id
      from public.contributors
      where lower(full_name) = lower(v_contributor ->> 'name')
      limit 1;

      if v_contributor_id is null then
        insert into public.contributors (
          full_name,
          stage_name,
          role,
          contributor_type
        )
        values (
          v_contributor ->> 'name',
          v_contributor ->> 'name',
          coalesce(v_contributor ->> 'role', 'composer'),
          'person'
        )
        returning id into v_contributor_id;
      end if;
    end if;

    insert into public.work_contributors (
      work_id,
      contributor_id,
      role,
      split_type,
      percentage,
      confirmed
    )
    values (
      v_work_id,
      v_contributor_id,
      coalesce(v_contributor ->> 'role', 'composer'),
      coalesce(v_contributor ->> 'split_type', 'composition'),
      coalesce((v_contributor ->> 'percentage')::numeric, 0),
      false
    );
  end loop;

  return jsonb_build_object(
    'success', true,
    'asset_id', v_asset_id,
    'work_id', v_work_id,
    'contributor_count', v_contributor_count
  );
end;
$$;
