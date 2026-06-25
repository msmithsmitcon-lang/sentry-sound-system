-- Foundational migration: public.assets, public.musical_works, public.contributors
--
-- These three tables were referenced (via FK, ALTER TABLE, and the
-- rpc_create_song_with_contributors RPC) by multiple later migrations but
-- were never created anywhere in this migration history. Schema below was
-- reverse-derived from sql/platform/rpc_create_song_with_contributors.sql
-- and every ALTER TABLE statement targeting these tables in:
--   20260520090000_workspace_owned_works_seed.sql
--   20260622000001_music_genre_enum_bpm_key.sql
--   20260622000004_musical_works_cmo_required_fields.sql
--   20260625100000_song_metadata_expansion.sql
--   20260625100100_contributors_system.sql
--
-- genre is created as plain text deliberately — 20260622000001 converts it
-- to the music_genre enum later, and that type doesn't exist yet here.

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id),
  created_by_user_id text,
  title text,
  asset_type text not null,
  created_at timestamptz not null default now()
);

create index idx_assets_workspace_id on public.assets(workspace_id);

create table public.musical_works (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id),
  created_by_user_id text,
  asset_id uuid references public.assets(id) on delete set null,
  work_title text not null,
  genre text,
  mood text,
  copyright_status text default 'draft',
  registration_status text default 'draft',
  created_at timestamptz not null default now()
);

create index idx_musical_works_workspace_id on public.musical_works(workspace_id);
create index idx_musical_works_workspace_created_at on public.musical_works(workspace_id, created_at desc);

create table public.contributors (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id),
  created_by_user_id text,
  full_name text not null,
  stage_name text,
  role text,
  contributor_type text default 'person',
  created_at timestamptz not null default now()
);

create index idx_contributors_workspace_id on public.contributors(workspace_id);

-- work_contributors / recording_contributors moved here from
-- 20260625100100_contributors_system.sql: that file created them on
-- 2026-06-25, but 20260520090000_workspace_owned_works_seed.sql and
-- 20260622000001_music_genre_enum_bpm_key.sql already ALTER/INSERT into
-- work_contributors months earlier. Creating both here, right after
-- their dependencies, fixes the ordering.
--
-- recording_contributors.recording_id has no FK to public.recordings —
-- that table doesn't exist anywhere in this migration history (only
-- evidence is a pre-2026-05-20 reset script proving it once held data,
-- no column structure). Left as a plain uuid column rather than guessing
-- a schema from a row-count delete script.

create table public.work_contributors (
  id uuid primary key default gen_random_uuid(),
  work_id uuid references public.musical_works(id) on delete cascade,
  contributor_id uuid references public.contributors(id) on delete cascade,
  role text not null,
  split_type text,
  percentage numeric(5,2),
  notes text,
  confirmed boolean default false,
  created_at timestamp default now()
);

create table public.recording_contributors (
  id uuid primary key default gen_random_uuid(),
  recording_id uuid,
  contributor_id uuid references public.contributors(id) on delete cascade,
  role text not null,
  split_type text,
  percentage numeric(5,2),
  notes text,
  confirmed boolean default false,
  created_at timestamp default now()
);
