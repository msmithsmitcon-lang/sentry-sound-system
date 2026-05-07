alter table projects
drop constraint if exists projects_party_id_fkey;

alter table projects
alter column party_id drop not null;
