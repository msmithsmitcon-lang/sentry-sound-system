alter table finance_exchange_rates
add column if not exists source_name text;

alter table finance_exchange_rates
add column if not exists source_type text;

alter table finance_exchange_rates
add column if not exists source_reference text;

alter table finance_exchange_rates
add column if not exists fetched_at timestamptz;

alter table finance_exchange_rates
add column if not exists is_official boolean not null default false;
