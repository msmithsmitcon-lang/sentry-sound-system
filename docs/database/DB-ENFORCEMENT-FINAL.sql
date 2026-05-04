-- FINAL DB ENFORCEMENT (SAFE VERSION)

-- ROYALTY LEDGER

alter table royalty_ledger
add constraint if not exists royalty_ledger_amount_positive
check (amount > 0);

alter table royalty_ledger
add constraint if not exists royalty_ledger_entry_type_valid
check (entry_type in ('debit', 'credit', 'adjustment'));

-- ROYALTY DISTRIBUTIONS

alter table royalty_distributions
add constraint if not exists royalty_distributions_amount_positive
check (amount > 0);

alter table royalty_distributions
add constraint if not exists royalty_distributions_percentage_valid
check (percentage > 0 and percentage <= 100);

alter table royalty_distributions
add constraint if not exists royalty_distributions_unique_event_contributor
unique (royalty_event_id, contributor_id);

-- PAYOUT ITEMS

alter table payout_items
add constraint if not exists payout_items_amount_positive
check (amount > 0);

alter table payout_items
add constraint if not exists payout_items_unique_batch_contributor
unique (payout_batch_id, contributor_id);

-- PAYOUT BATCH STATUS

alter table payout_batches
add constraint if not exists payout_batches_status_valid
check (status in ('draft', 'pending', 'processed', 'cancelled', 'failed'));

-- SETTLEMENT STATUS

alter table settlements
add constraint if not exists settlements_status_valid
check (status in ('pending', 'settled', 'cancelled', 'reversed'));
