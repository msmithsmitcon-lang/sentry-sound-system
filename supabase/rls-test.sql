-- TEMP TEST POLICY (DEV ONLY)

alter table assets enable row level security;

create policy "Allow insert for anon"
on assets
for insert
to anon
with check (true);

create policy "Allow select for anon"
on assets
for select
to anon
using (true);
