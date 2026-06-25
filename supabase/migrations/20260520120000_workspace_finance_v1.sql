-- Workspace-owned Finance / Accounting V1.
-- This V1 layer keeps active product finance separate from older unscoped
-- finance prototype tables until the broader ERP subsystem is aligned.

CREATE TABLE IF NOT EXISTS public.workspace_finance_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  category_type text NOT NULL CHECK (category_type IN ('income', 'expense', 'payable', 'receivable', 'general')),
  is_active boolean NOT NULL DEFAULT true,
  created_by_user_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, name, category_type)
);

CREATE TABLE IF NOT EXISTS public.workspace_finance_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  account_name text NOT NULL,
  account_type text NOT NULL CHECK (account_type IN ('cash', 'income', 'expense', 'payable', 'receivable')),
  currency text NOT NULL DEFAULT 'ZAR',
  opening_balance numeric(18,2) NOT NULL DEFAULT 0,
  current_balance numeric(18,2) NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_by_user_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, account_name, account_type)
);

CREATE TABLE IF NOT EXISTS public.workspace_finance_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  transaction_type text NOT NULL CHECK (transaction_type IN ('income', 'expense', 'transfer', 'adjustment')),
  amount numeric(18,2) NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'ZAR',
  transaction_date date NOT NULL DEFAULT current_date,
  description text NOT NULL,
  category text,
  status text NOT NULL DEFAULT 'posted' CHECK (status IN ('draft', 'posted', 'reconciled', 'cancelled')),
  source_module text NOT NULL DEFAULT 'manual' CHECK (source_module IN ('manual', 'royalty', 'submission', 'crm', 'other')),
  related_entity_type text,
  related_entity_id uuid,
  created_by_user_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.workspace_finance_payables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  vendor_name text NOT NULL,
  description text NOT NULL,
  amount numeric(18,2) NOT NULL CHECK (amount > 0),
  outstanding_amount numeric(18,2) NOT NULL CHECK (outstanding_amount >= 0),
  currency text NOT NULL DEFAULT 'ZAR',
  due_date date,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'partial', 'paid', 'cancelled')),
  source_module text NOT NULL DEFAULT 'manual' CHECK (source_module IN ('manual', 'royalty', 'submission', 'crm', 'other')),
  related_entity_type text,
  related_entity_id uuid,
  created_by_user_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.workspace_finance_receivables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  description text NOT NULL,
  amount numeric(18,2) NOT NULL CHECK (amount > 0),
  outstanding_amount numeric(18,2) NOT NULL CHECK (outstanding_amount >= 0),
  currency text NOT NULL DEFAULT 'ZAR',
  due_date date,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'partial', 'paid', 'cancelled')),
  source_module text NOT NULL DEFAULT 'manual' CHECK (source_module IN ('manual', 'royalty', 'submission', 'crm', 'other')),
  related_entity_type text,
  related_entity_id uuid,
  created_by_user_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workspace_finance_categories_workspace
  ON public.workspace_finance_categories(workspace_id, category_type);

CREATE INDEX IF NOT EXISTS idx_workspace_finance_accounts_workspace
  ON public.workspace_finance_accounts(workspace_id, account_type);

CREATE INDEX IF NOT EXISTS idx_workspace_finance_transactions_workspace_date
  ON public.workspace_finance_transactions(workspace_id, transaction_date DESC);

CREATE INDEX IF NOT EXISTS idx_workspace_finance_transactions_workspace_type
  ON public.workspace_finance_transactions(workspace_id, transaction_type);

CREATE INDEX IF NOT EXISTS idx_workspace_finance_transactions_source_entity
  ON public.workspace_finance_transactions(source_module, related_entity_type, related_entity_id);

CREATE INDEX IF NOT EXISTS idx_workspace_finance_payables_workspace_status
  ON public.workspace_finance_payables(workspace_id, status, due_date);

CREATE INDEX IF NOT EXISTS idx_workspace_finance_receivables_workspace_status
  ON public.workspace_finance_receivables(workspace_id, status, due_date);
