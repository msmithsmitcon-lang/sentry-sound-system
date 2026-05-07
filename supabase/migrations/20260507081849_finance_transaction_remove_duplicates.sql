delete from finance_transactions ft
using finance_transactions duplicate
where ft.reference_type = duplicate.reference_type
  and ft.reference_id = duplicate.reference_id
  and ft.created_at > duplicate.created_at;
