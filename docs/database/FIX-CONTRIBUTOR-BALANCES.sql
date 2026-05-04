-- Fix contributor_balances structure

alter table contributor_balances
add column if not exists total_credits numeric default 0;

alter table contributor_balances
add column if not exists total_debits numeric default 0;

alter table contributor_balances
add column if not exists balance numeric default 0;

alter table contributor_balances
add column if not exists updated_at timestamp;
