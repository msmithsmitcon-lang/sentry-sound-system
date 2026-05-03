-- TEMP TEST POLICY (DEV ONLY)

alter table musical_works enable row level security;

create policy "Allow insert for anon"
on musical_works
for insert
to anon
with check (true);

create policy "Allow select for anon"
on musical_works
for select
to anon
using (true);
