-- Sentry Sound — Royalty Engine Test Seed
-- Run manually in Supabase SQL Editor

-- 1. Account
insert into accounts (id, name, slug)
values (
  'ff92e800-57ea-4f57-a47d-69c16260da8a',
  'Sentry Sound Test Account',
  'sentry-sound-test'
)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug;

-- 2. Asset
insert into assets (id, title, asset_type)
values (
  '00000000-0000-0000-0000-000000000002',
  'Test Song Asset',
  'music'
)
on conflict (id) do nothing;

-- 3. Musical Work
insert into musical_works (id, asset_id, work_title)
values (
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000002',
  'Test Work'
)
on conflict (id) do nothing;

-- 4. Contributor
insert into contributors (id, full_name)
values (
  '00000000-0000-0000-0000-000000000004',
  'Test Composer'
)
on conflict (id) do nothing;

-- 5. Work Contributor Split
insert into work_contributors (id, work_id, contributor_id, percentage, role)
values (
  '00000000-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000004',
  100,
  'composer'
)
on conflict (id) do update set
  percentage = excluded.percentage,
  role = excluded.role;

-- 6. Clean prior test processing
delete from royalty_ledger
where royalty_distribution_id in (
  select id from royalty_distributions
  where royalty_event_id = '00000000-0000-0000-0000-000000000006'
);

delete from royalty_distributions
where royalty_event_id = '00000000-0000-0000-0000-000000000006';

-- 7. Royalty Event
insert into royalty_events (id, account_id, work_id, gross_amount, source, status)
values (
  '00000000-0000-0000-0000-000000000006',
  'ff92e800-57ea-4f57-a47d-69c16260da8a',
  '00000000-0000-0000-0000-000000000003',
  1000,
  'manual',
  'draft'
)
on conflict (id) do update set
  account_id = excluded.account_id,
  work_id = excluded.work_id,
  gross_amount = excluded.gross_amount,
  source = excluded.source,
  status = excluded.status;
