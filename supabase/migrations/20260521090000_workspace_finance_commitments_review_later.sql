-- Add the lightweight review_later operational status for Finance V2 commitments.

ALTER TABLE public.workspace_finance_commitments
  DROP CONSTRAINT IF EXISTS workspace_finance_commitments_status_check;

ALTER TABLE public.workspace_finance_commitments
  ADD CONSTRAINT workspace_finance_commitments_status_check
  CHECK (status IN ('planned', 'due', 'overdue', 'paid', 'cancelled', 'review_later'));
