alter table finance_accounts
add column if not exists category text;

alter table finance_accounts
add column if not exists subcategory text;
