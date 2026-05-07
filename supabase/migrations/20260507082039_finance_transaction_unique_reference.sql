alter table finance_transactions
add constraint finance_transactions_unique_reference
unique (reference_type, reference_id);
