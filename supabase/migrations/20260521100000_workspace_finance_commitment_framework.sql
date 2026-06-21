-- Finance V2 Phase 1 structured commitment framework.
-- Adds domain, nature, and risk fields while preserving existing commitment rows.

ALTER TABLE public.workspace_finance_commitments
  ADD COLUMN IF NOT EXISTS commitment_nature text NOT NULL DEFAULT 'operational',
  ADD COLUMN IF NOT EXISTS commitment_risk_level text NOT NULL DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS commitment_domain text NOT NULL DEFAULT 'other';

UPDATE public.workspace_finance_commitments
SET
  commitment_domain = CASE
    WHEN commitment_type IN ('annual_fee') AND industry_body = 'cipc' THEN 'compliance'
    WHEN commitment_type IN ('annual_fee') AND industry_body IN ('samro', 'capasso') THEN 'compliance'
    WHEN commitment_type IN ('provisional_tax') THEN 'tax'
    WHEN commitment_type IN ('contributor_payable', 'producer_fee', 'royalty_payable') THEN 'contributor_obligations'
    WHEN commitment_type IN ('studio_booking') THEN 'production'
    WHEN commitment_type IN ('distribution_fee', 'release_campaign') THEN 'release_marketing'
    WHEN commitment_type IN ('software_subscription') THEN 'software_infrastructure'
    ELSE commitment_domain
  END,
  commitment_type = CASE
    WHEN commitment_type = 'annual_fee' AND industry_body = 'cipc' THEN 'cipc_annual_return'
    WHEN commitment_type = 'annual_fee' AND industry_body = 'samro' THEN 'samro_membership_fee'
    WHEN commitment_type = 'annual_fee' AND industry_body = 'capasso' THEN 'capasso_admin_fee'
    WHEN commitment_type = 'contributor_payable' THEN 'contractor_payment'
    WHEN commitment_type = 'producer_fee' THEN 'producer_payment'
    WHEN commitment_type = 'distribution_fee' THEN 'dsp_distribution'
    WHEN commitment_type = 'release_campaign' THEN 'release_campaign'
    WHEN commitment_type = 'software_subscription' THEN 'software_subscription'
    ELSE commitment_type
  END,
  commitment_nature = CASE
    WHEN commitment_category IN ('compliance', 'tax', 'revenue_obligation') THEN 'mandatory'
    WHEN commitment_category = 'project_production' THEN 'strategic'
    ELSE commitment_nature
  END,
  commitment_risk_level = CASE
    WHEN commitment_category = 'tax' THEN 'critical'
    WHEN commitment_category IN ('compliance', 'contributor_contractor', 'revenue_obligation') THEN 'high'
    WHEN commitment_category IN ('project_production', 'marketing', 'professional_services') THEN 'medium'
    ELSE commitment_risk_level
  END;

ALTER TABLE public.workspace_finance_commitments
  DROP CONSTRAINT IF EXISTS workspace_finance_commitments_commitment_nature_check,
  DROP CONSTRAINT IF EXISTS workspace_finance_commitments_commitment_risk_level_check,
  DROP CONSTRAINT IF EXISTS workspace_finance_commitments_commitment_domain_check,
  DROP CONSTRAINT IF EXISTS workspace_finance_commitments_commitment_type_check;

ALTER TABLE public.workspace_finance_commitments
  ADD CONSTRAINT workspace_finance_commitments_commitment_nature_check
  CHECK (commitment_nature IN ('mandatory', 'operational', 'strategic', 'optional')),
  ADD CONSTRAINT workspace_finance_commitments_commitment_risk_level_check
  CHECK (commitment_risk_level IN ('low', 'medium', 'high', 'critical')),
  ADD CONSTRAINT workspace_finance_commitments_commitment_domain_check
  CHECK (
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
  ADD CONSTRAINT workspace_finance_commitments_commitment_type_check
  CHECK (
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
      'release_campaign',
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
      'software_subscription',
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
      'other'
    )
  );

CREATE INDEX IF NOT EXISTS idx_workspace_finance_commitments_domain_risk
  ON public.workspace_finance_commitments(workspace_id, commitment_domain, commitment_risk_level, commitment_nature);
