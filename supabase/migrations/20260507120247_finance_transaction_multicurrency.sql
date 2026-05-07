alter table finance_transactions
add column if not exists original_currency text not null default 'ZAR';

alter table finance_transactions
add column if not exists original_amount numeric(18,2);

alter table finance_transactions
add column if not exists base_currency text not null default 'ZAR';

alter table finance_transactions
add column if not exists base_amount numeric(18,2);

alter table finance_transactions
add column if not exists exchange_rate_used numeric(18,6);

alter table finance_transactions
add column if not exists exchange_rate_source text;

alter table finance_transactions
add column if not exists exchange_rate_date date;
