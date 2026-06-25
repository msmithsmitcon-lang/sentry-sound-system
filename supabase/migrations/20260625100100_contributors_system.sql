-- Contributors System Expansion V1
--
-- work_contributors and recording_contributors moved to
-- 20260507131900_musical_works_and_contributors.sql to fix an ordering bug
-- (they were being altered/inserted into months before this file ran).

alter table contributors
add column if not exists contributor_type text default 'person',
add column if not exists legal_name text,
add column if not exists stage_name text,
add column if not exists id_number text,
add column if not exists company_registration_number text,
add column if not exists tax_number text,
add column if not exists address text,
add column if not exists banking_status text default 'not_captured',
add column if not exists metadata jsonb default '{}'::jsonb;
