-- Sentry Sound — Step 2: Database Enforcement Layer
-- Run manually in Supabase SQL Editor

-- 1. Royalty ledger: amount must be positive
alter table royalty_ledger
add constraint royalty_ledger_amount_positive
check (amount > 0);

-- 2. Royalty ledger: entry type must be debit or credit
alter table royalty_ledger
add constraint royalty_ledger_entry_type_valid
check (entry_type in ('debit', 'credit'));

-- 3. Royalty distributions: amount must be positive
alter table royalty_distributions
add constraint royalty_distributions_amount_positive
check (amount > 0);

-- 4. Royalty distributions: percentage must be valid
alter table royalty_distributions
add constraint royalty_distributions_percentage_valid
check (percentage > 0 and percentage <= 100);

-- 5. Prevent duplicate distribution per royalty event/contributor
alter table royalty_distributions
add constraint royalty_distributions_unique_event_contributor
unique (royalty_event_id, contributor_id);

-- 6. Payout items: amount must be positive
alter table payout_items
add constraint payout_items_amount_positive
check (amount > 0);

-- 7. Prevent duplicate payout item per batch/contributor
alter table payout_items
add constraint payout_items_unique_batch_contributor
unique (payout_batch_id, contributor_id);

-- 8. Contributor balances: balance fields cannot be null
alter table contributor_balances
alter column total_credits set default 0,
alter column total_debits set default 0,
alter column balance set default 0;

-- 9. Payout batch status enforcement
alter table payout_batches
add constraint payout_batches_status_valid
check (status in ('draft', 'pending', 'processed', 'cancelled', 'failed'));

-- 10. Settlement status enforcement
alter table settlements
add constraint settlements_status_valid
check (status in ('pending', 'settled', 'cancelled', 'reversed'));
