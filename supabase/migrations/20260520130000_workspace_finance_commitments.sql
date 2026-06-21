-- Workspace-owned Finance V2 Phase 1 commitments.
-- Commitments track obligations/responsibilities before or alongside payment.
-- They are not tax automation, payout automation, AI forecasting, or royalty calculation.

CREATE TABLE IF NOT EXISTS public.workspace_finance_commitments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  amount numeric(18,2) CHECK (amount IS NULL OR amount >= 0),
  currency text NOT NULL DEFAULT 'ZAR',
  due_date date,
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'due', 'overdue', 'paid', 'cancelled', 'review_later')),
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  commitment_nature text NOT NULL DEFAULT 'operational' CHECK (commitment_nature IN ('mandatory', 'operational', 'strategic', 'optional')),
  commitment_risk_level text NOT NULL DEFAULT 'medium' CHECK (commitment_risk_level IN ('low', 'medium', 'high', 'critical')),
  commitment_domain text NOT NULL DEFAULT 'other' CHECK (
    commitment_domain IN (
      'compliance',
      'tax',
      'contributor_obligations',
      'production',
      'release_marketing',
      'operations',
      'software_infrastructure',
      'legal_governance',
      'finance_funding',
      'revenue_sharing',
      'growth_expansion',
      'other'
    )
  ),
  commitment_category text NOT NULL CHECK (
    commitment_category IN (
      'compliance',
      'tax',
      'contributor_contractor',
      'operational_expense',
      'project_production',
      'marketing',
      'software_subscription',
      'professional_services',
      'revenue_obligation',
      'other'
    )
  ),
  industry text NOT NULL DEFAULT 'music' CHECK (industry IN ('music', 'general')),
  industry_body text NOT NULL DEFAULT 'none' CHECK (
    industry_body IN (
      'samro',
      'capasso',
      'cipc',
      'sars',
      'distributor',
      'publisher',
      'pro_cmo',
      'other',
      'none'
    )
  ),
  commitment_type text NOT NULL CHECK (
    commitment_type IN (
      'cipc_annual_return',
      'samro_membership_fee',
      'capasso_admin_fee',
      'popia_compliance',
      'coida',
      'music_licensing',
      'other_compliance',
      'provisional_tax',
      'vat',
      'income_tax',
      'paye',
      'other_tax',
      'producer_payment',
      'session_musician_fee',
      'featured_artist_payment',
      'songwriter_share',
      'royalty_distribution',
      'contractor_payment',
      'other_contributor_obligation',
      'studio_booking',
      'mixing',
      'mastering',
      'artwork',
      'video_shoot',
      'rehearsal',
      'equipment_hire',
      'other_production',
      'dsp_distribution',
      'playlist_campaign',
      'pr_campaign',
      'social_ads',
      'radio_plugging',
      'launch_event',
      'content_creation',
      'other_release_marketing',
      'office_rent',
      'internet',
      'utilities',
      'staff_salary',
      'admin_cost',
      'transport',
      'other_operations',
      'hosting',
      'cloud_storage',
      'ai_subscription',
      'daw_subscription',
      'design_software',
      'accounting_software',
      'other_software_infrastructure',
      'contract_review',
      'company_secretarial',
      'legal_consultation',
      'dispute_resolution',
      'governance_admin',
      'other_legal_governance',
      'loan_repayment',
      'investor_reporting',
      'bank_charges',
      'funding_application',
      'financial_review',
      'other_finance_funding',
      'royalty_payable',
      'licensing_share',
      'profit_share',
      'collaborator_share',
      'other_revenue_sharing',
      'training',
      'business_development',
      'market_research',
      'partnership_development',
      'expansion_project',
      'other_growth_expansion',
      'distribution_fee',
      'release_campaign',
      'software_subscription',
      'other'
    )
  ),
  related_module text,
  related_entity_type text,
  related_entity_id uuid,
  created_by_user_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workspace_finance_commitments_workspace_due
  ON public.workspace_finance_commitments(workspace_id, due_date ASC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_workspace_finance_commitments_workspace_status
  ON public.workspace_finance_commitments(workspace_id, status, priority);

CREATE INDEX IF NOT EXISTS idx_workspace_finance_commitments_classification
  ON public.workspace_finance_commitments(workspace_id, commitment_category, industry, industry_body, commitment_domain, commitment_type);

CREATE INDEX IF NOT EXISTS idx_workspace_finance_commitments_related_entity
  ON public.workspace_finance_commitments(related_module, related_entity_type, related_entity_id);
