alter table public.distribution_releases
  add constraint fk_distribution_releases_source_release
  foreign key (source_release_id)
  references public.releases(id)
  on delete set null;

create index if not exists idx_distribution_releases_source_release
  on public.distribution_releases(source_release_id);
