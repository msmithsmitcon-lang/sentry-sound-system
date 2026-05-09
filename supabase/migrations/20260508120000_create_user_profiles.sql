create table if not exists user_profiles (
    id uuid primary key default gen_random_uuid(),

    clerk_user_id text not null unique,
    primary_email text,
    first_name text,
    last_name text,

    status text not null default 'active'
        check (status in ('active','inactive','suspended','pending')),

    metadata jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_user_profiles_clerk_user_id
on user_profiles(clerk_user_id);

create index if not exists idx_user_profiles_primary_email
on user_profiles(primary_email);