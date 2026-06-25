export const WORKSPACE_FINANCE_SOURCE = "workspace_finance_v1" as const

export type FinanceTransactionType = "income" | "expense" | "transfer" | "adjustment"
export type FinanceTransactionStatus = "draft" | "posted" | "reconciled" | "cancelled"
export type FinanceSourceModule = "manual" | "royalty" | "submission" | "crm" | "other"
export type FinanceAccountType = "cash" | "income" | "expense" | "payable" | "receivable"
export type FinanceObligationStatus = "open" | "partial" | "paid" | "cancelled"
export type FinanceCommitmentStatus =
  | "planned"
  | "due"
  | "overdue"
  | "paid"
  | "cancelled"
  | "review_later"
export type FinanceCommitmentAction = "mark_paid" | "cancel" | "review_later"
export type FinanceCommitmentPriority = "low" | "normal" | "high" | "urgent"
export type FinanceCommitmentNature =
  | "mandatory"
  | "operational"
  | "strategic"
  | "optional"
export type FinanceCommitmentRiskLevel = "low" | "medium" | "high" | "critical"
export type FinanceCommitmentDomain =
  | "compliance"
  | "tax"
  | "contributor_obligations"
  | "production"
  | "release_marketing"
  | "operations"
  | "software_infrastructure"
  | "legal_governance"
  | "finance_funding"
  | "revenue_sharing"
  | "growth_expansion"
  | "other"
export type FinanceCommitmentCategory =
  | "compliance"
  | "tax"
  | "contributor_contractor"
  | "operational_expense"
  | "project_production"
  | "marketing"
  | "software_subscription"
  | "professional_services"
  | "revenue_obligation"
  | "other"
export type FinanceCommitmentIndustry = "music" | "general"
export type FinanceCommitmentIndustryBody =
  | "samro"
  | "capasso"
  | "cipc"
  | "sars"
  | "distributor"
  | "publisher"
  | "pro_cmo"
  | "other"
  | "none"
export type FinanceCommitmentType =
  | "cipc_annual_return"
  | "samro_membership_fee"
  | "capasso_admin_fee"
  | "popia_compliance"
  | "coida"
  | "music_licensing"
  | "other_compliance"
  | "provisional_tax"
  | "vat"
  | "income_tax"
  | "paye"
  | "other_tax"
  | "producer_payment"
  | "session_musician_fee"
  | "featured_artist_payment"
  | "songwriter_share"
  | "royalty_distribution"
  | "contractor_payment"
  | "other_contributor_obligation"
  | "studio_booking"
  | "mixing"
  | "mastering"
  | "artwork"
  | "video_shoot"
  | "rehearsal"
  | "equipment_hire"
  | "other_production"
  | "dsp_distribution"
  | "playlist_campaign"
  | "pr_campaign"
  | "social_ads"
  | "radio_plugging"
  | "launch_event"
  | "content_creation"
  | "other_release_marketing"
  | "office_rent"
  | "internet"
  | "utilities"
  | "staff_salary"
  | "admin_cost"
  | "transport"
  | "other_operations"
  | "hosting"
  | "cloud_storage"
  | "ai_subscription"
  | "daw_subscription"
  | "design_software"
  | "accounting_software"
  | "other_software_infrastructure"
  | "contract_review"
  | "company_secretarial"
  | "legal_consultation"
  | "dispute_resolution"
  | "governance_admin"
  | "other_legal_governance"
  | "loan_repayment"
  | "investor_reporting"
  | "bank_charges"
  | "funding_application"
  | "financial_review"
  | "other_finance_funding"
  | "royalty_payable"
  | "licensing_share"
  | "profit_share"
  | "collaborator_share"
  | "other_revenue_sharing"
  | "training"
  | "business_development"
  | "market_research"
  | "partnership_development"
  | "expansion_project"
  | "other_growth_expansion"
  | "release_campaign"
  | "software_subscription"
  | "other"

export type FinanceCommitmentTypeOption = {
  value: FinanceCommitmentType
  label: string
  defaultNature: FinanceCommitmentNature
  defaultRiskLevel: FinanceCommitmentRiskLevel
}

export type FinanceCommitmentDomainOption = {
  value: FinanceCommitmentDomain
  label: string
  category: FinanceCommitmentCategory
  types: FinanceCommitmentTypeOption[]
}

export const financeCommitmentStatuses = [
  "planned",
  "due",
  "overdue",
  "paid",
  "cancelled",
  "review_later",
] as const

export const financeCommitmentPriorities = [
  "low",
  "normal",
  "high",
  "urgent",
] as const

export const financeCommitmentNatures = [
  "mandatory",
  "operational",
  "strategic",
  "optional",
] as const

export const financeCommitmentRiskLevels = [
  "low",
  "medium",
  "high",
  "critical",
] as const

export const financeCommitmentDomains = [
  "compliance",
  "tax",
  "contributor_obligations",
  "production",
  "release_marketing",
  "operations",
  "software_infrastructure",
  "legal_governance",
  "finance_funding",
  "revenue_sharing",
  "growth_expansion",
  "other",
] as const

export const financeCommitmentCategories = [
  "compliance",
  "tax",
  "contributor_contractor",
  "operational_expense",
  "project_production",
  "marketing",
  "software_subscription",
  "professional_services",
  "revenue_obligation",
  "other",
] as const

export const financeCommitmentIndustries = ["music", "general"] as const

export const financeCommitmentIndustryBodies = [
  "samro",
  "capasso",
  "cipc",
  "sars",
  "distributor",
  "publisher",
  "pro_cmo",
  "other",
  "none",
] as const

export const financeCommitmentTypes = [
  "cipc_annual_return",
  "samro_membership_fee",
  "capasso_admin_fee",
  "popia_compliance",
  "coida",
  "music_licensing",
  "other_compliance",
  "provisional_tax",
  "vat",
  "income_tax",
  "paye",
  "other_tax",
  "producer_payment",
  "session_musician_fee",
  "featured_artist_payment",
  "songwriter_share",
  "royalty_distribution",
  "contractor_payment",
  "other_contributor_obligation",
  "studio_booking",
  "mixing",
  "mastering",
  "artwork",
  "video_shoot",
  "rehearsal",
  "equipment_hire",
  "other_production",
  "dsp_distribution",
  "playlist_campaign",
  "pr_campaign",
  "social_ads",
  "radio_plugging",
  "launch_event",
  "content_creation",
  "other_release_marketing",
  "release_campaign",
  "office_rent",
  "internet",
  "utilities",
  "staff_salary",
  "admin_cost",
  "transport",
  "other_operations",
  "hosting",
  "cloud_storage",
  "ai_subscription",
  "daw_subscription",
  "design_software",
  "accounting_software",
  "software_subscription",
  "other_software_infrastructure",
  "contract_review",
  "company_secretarial",
  "legal_consultation",
  "dispute_resolution",
  "governance_admin",
  "other_legal_governance",
  "loan_repayment",
  "investor_reporting",
  "bank_charges",
  "funding_application",
  "financial_review",
  "other_finance_funding",
  "royalty_payable",
  "licensing_share",
  "profit_share",
  "collaborator_share",
  "other_revenue_sharing",
  "training",
  "business_development",
  "market_research",
  "partnership_development",
  "expansion_project",
  "other_growth_expansion",
  "other",
] as const

export const financeCommitmentDomainOptions = [
  {
    value: "compliance",
    label: "Compliance",
    category: "compliance",
    types: [
      { value: "cipc_annual_return", label: "CIPC annual return", defaultNature: "mandatory", defaultRiskLevel: "high" },
      { value: "samro_membership_fee", label: "SAMRO membership fee", defaultNature: "mandatory", defaultRiskLevel: "medium" },
      { value: "capasso_admin_fee", label: "CAPASSO admin fee", defaultNature: "mandatory", defaultRiskLevel: "medium" },
      { value: "popia_compliance", label: "POPIA compliance", defaultNature: "mandatory", defaultRiskLevel: "high" },
      { value: "coida", label: "COIDA", defaultNature: "mandatory", defaultRiskLevel: "high" },
      { value: "music_licensing", label: "Music licensing", defaultNature: "mandatory", defaultRiskLevel: "high" },
      { value: "other_compliance", label: "Other compliance", defaultNature: "mandatory", defaultRiskLevel: "high" },
    ],
  },
  {
    value: "tax",
    label: "Tax",
    category: "tax",
    types: [
      { value: "provisional_tax", label: "Provisional tax", defaultNature: "mandatory", defaultRiskLevel: "critical" },
      { value: "vat", label: "VAT", defaultNature: "mandatory", defaultRiskLevel: "critical" },
      { value: "income_tax", label: "Income tax", defaultNature: "mandatory", defaultRiskLevel: "critical" },
      { value: "paye", label: "PAYE", defaultNature: "mandatory", defaultRiskLevel: "critical" },
      { value: "other_tax", label: "Other tax", defaultNature: "mandatory", defaultRiskLevel: "critical" },
    ],
  },
  {
    value: "contributor_obligations",
    label: "Contributor Obligations",
    category: "contributor_contractor",
    types: [
      { value: "producer_payment", label: "Producer payment", defaultNature: "operational", defaultRiskLevel: "high" },
      { value: "session_musician_fee", label: "Session musician fee", defaultNature: "operational", defaultRiskLevel: "high" },
      { value: "featured_artist_payment", label: "Featured artist payment", defaultNature: "operational", defaultRiskLevel: "high" },
      { value: "songwriter_share", label: "Songwriter share", defaultNature: "mandatory", defaultRiskLevel: "high" },
      { value: "royalty_distribution", label: "Royalty distribution", defaultNature: "mandatory", defaultRiskLevel: "high" },
      { value: "contractor_payment", label: "Contractor payment", defaultNature: "operational", defaultRiskLevel: "high" },
      { value: "other_contributor_obligation", label: "Other contributor obligation", defaultNature: "operational", defaultRiskLevel: "high" },
    ],
  },
  {
    value: "production",
    label: "Production",
    category: "project_production",
    types: [
      { value: "studio_booking", label: "Studio booking", defaultNature: "operational", defaultRiskLevel: "medium" },
      { value: "mixing", label: "Mixing", defaultNature: "operational", defaultRiskLevel: "medium" },
      { value: "mastering", label: "Mastering", defaultNature: "operational", defaultRiskLevel: "medium" },
      { value: "artwork", label: "Artwork", defaultNature: "strategic", defaultRiskLevel: "medium" },
      { value: "video_shoot", label: "Video shoot", defaultNature: "strategic", defaultRiskLevel: "medium" },
      { value: "rehearsal", label: "Rehearsal", defaultNature: "operational", defaultRiskLevel: "medium" },
      { value: "equipment_hire", label: "Equipment hire", defaultNature: "operational", defaultRiskLevel: "medium" },
      { value: "other_production", label: "Other production", defaultNature: "operational", defaultRiskLevel: "medium" },
    ],
  },
  {
    value: "release_marketing",
    label: "Release & Marketing",
    category: "marketing",
    types: [
      { value: "dsp_distribution", label: "DSP distribution", defaultNature: "operational", defaultRiskLevel: "medium" },
      { value: "playlist_campaign", label: "Playlist campaign", defaultNature: "strategic", defaultRiskLevel: "medium" },
      { value: "pr_campaign", label: "PR campaign", defaultNature: "strategic", defaultRiskLevel: "medium" },
      { value: "social_ads", label: "Social ads", defaultNature: "strategic", defaultRiskLevel: "medium" },
      { value: "radio_plugging", label: "Radio plugging", defaultNature: "strategic", defaultRiskLevel: "medium" },
      { value: "launch_event", label: "Launch event", defaultNature: "strategic", defaultRiskLevel: "medium" },
      { value: "content_creation", label: "Content creation", defaultNature: "strategic", defaultRiskLevel: "medium" },
      { value: "release_campaign", label: "Release campaign", defaultNature: "strategic", defaultRiskLevel: "medium" },
      { value: "other_release_marketing", label: "Other release marketing", defaultNature: "strategic", defaultRiskLevel: "medium" },
    ],
  },
  {
    value: "operations",
    label: "Operations",
    category: "operational_expense",
    types: [
      { value: "office_rent", label: "Office rent", defaultNature: "operational", defaultRiskLevel: "medium" },
      { value: "internet", label: "Internet", defaultNature: "operational", defaultRiskLevel: "medium" },
      { value: "utilities", label: "Utilities", defaultNature: "operational", defaultRiskLevel: "medium" },
      { value: "staff_salary", label: "Staff salary", defaultNature: "mandatory", defaultRiskLevel: "high" },
      { value: "admin_cost", label: "Admin cost", defaultNature: "operational", defaultRiskLevel: "medium" },
      { value: "transport", label: "Transport", defaultNature: "operational", defaultRiskLevel: "low" },
      { value: "other_operations", label: "Other operations", defaultNature: "operational", defaultRiskLevel: "medium" },
    ],
  },
  {
    value: "software_infrastructure",
    label: "Software & Infrastructure",
    category: "software_subscription",
    types: [
      { value: "hosting", label: "Hosting", defaultNature: "operational", defaultRiskLevel: "medium" },
      { value: "cloud_storage", label: "Cloud storage", defaultNature: "operational", defaultRiskLevel: "medium" },
      { value: "ai_subscription", label: "AI subscription", defaultNature: "strategic", defaultRiskLevel: "low" },
      { value: "daw_subscription", label: "DAW subscription", defaultNature: "operational", defaultRiskLevel: "medium" },
      { value: "design_software", label: "Design software", defaultNature: "operational", defaultRiskLevel: "low" },
      { value: "accounting_software", label: "Accounting software", defaultNature: "operational", defaultRiskLevel: "medium" },
      { value: "software_subscription", label: "Software subscription", defaultNature: "operational", defaultRiskLevel: "medium" },
      { value: "other_software_infrastructure", label: "Other software infrastructure", defaultNature: "operational", defaultRiskLevel: "low" },
    ],
  },
  {
    value: "legal_governance",
    label: "Legal & Governance",
    category: "professional_services",
    types: [
      { value: "contract_review", label: "Contract review", defaultNature: "strategic", defaultRiskLevel: "high" },
      { value: "company_secretarial", label: "Company secretarial", defaultNature: "mandatory", defaultRiskLevel: "high" },
      { value: "legal_consultation", label: "Legal consultation", defaultNature: "strategic", defaultRiskLevel: "high" },
      { value: "dispute_resolution", label: "Dispute resolution", defaultNature: "mandatory", defaultRiskLevel: "critical" },
      { value: "governance_admin", label: "Governance admin", defaultNature: "mandatory", defaultRiskLevel: "high" },
      { value: "other_legal_governance", label: "Other legal governance", defaultNature: "strategic", defaultRiskLevel: "high" },
    ],
  },
  {
    value: "finance_funding",
    label: "Finance & Funding",
    category: "professional_services",
    types: [
      { value: "loan_repayment", label: "Loan repayment", defaultNature: "mandatory", defaultRiskLevel: "high" },
      { value: "investor_reporting", label: "Investor reporting", defaultNature: "mandatory", defaultRiskLevel: "high" },
      { value: "bank_charges", label: "Bank charges", defaultNature: "operational", defaultRiskLevel: "low" },
      { value: "funding_application", label: "Funding application", defaultNature: "strategic", defaultRiskLevel: "medium" },
      { value: "financial_review", label: "Financial review", defaultNature: "strategic", defaultRiskLevel: "medium" },
      { value: "other_finance_funding", label: "Other finance/funding", defaultNature: "strategic", defaultRiskLevel: "medium" },
    ],
  },
  {
    value: "revenue_sharing",
    label: "Revenue Sharing",
    category: "revenue_obligation",
    types: [
      { value: "royalty_payable", label: "Royalty payable", defaultNature: "mandatory", defaultRiskLevel: "high" },
      { value: "licensing_share", label: "Licensing share", defaultNature: "mandatory", defaultRiskLevel: "high" },
      { value: "profit_share", label: "Profit share", defaultNature: "mandatory", defaultRiskLevel: "high" },
      { value: "collaborator_share", label: "Collaborator share", defaultNature: "mandatory", defaultRiskLevel: "high" },
      { value: "other_revenue_sharing", label: "Other revenue sharing", defaultNature: "mandatory", defaultRiskLevel: "high" },
    ],
  },
  {
    value: "growth_expansion",
    label: "Growth & Expansion",
    category: "other",
    types: [
      { value: "training", label: "Training", defaultNature: "strategic", defaultRiskLevel: "low" },
      { value: "business_development", label: "Business development", defaultNature: "strategic", defaultRiskLevel: "medium" },
      { value: "market_research", label: "Market research", defaultNature: "strategic", defaultRiskLevel: "low" },
      { value: "partnership_development", label: "Partnership development", defaultNature: "strategic", defaultRiskLevel: "medium" },
      { value: "expansion_project", label: "Expansion project", defaultNature: "strategic", defaultRiskLevel: "medium" },
      { value: "other_growth_expansion", label: "Other growth/expansion", defaultNature: "strategic", defaultRiskLevel: "medium" },
    ],
  },
  {
    value: "other",
    label: "Other",
    category: "other",
    types: [
      { value: "other", label: "Other", defaultNature: "optional", defaultRiskLevel: "low" },
    ],
  },
] as const satisfies readonly FinanceCommitmentDomainOption[]

export type FinanceAccount = {
  id: string
  account_name: string
  account_type: FinanceAccountType
  currency: string
  current_balance: number
  is_active: boolean
}

export type FinanceCategory = {
  id: string
  name: string
  category_type: "income" | "expense" | "payable" | "receivable" | "general"
}

export type FinanceTransaction = {
  id: string
  transaction_type: FinanceTransactionType
  amount: number
  currency: string
  transaction_date: string
  description: string
  category: string | null
  status: FinanceTransactionStatus
  source_module: FinanceSourceModule
  related_entity_type: string | null
  related_entity_id: string | null
  created_at: string
}

export type FinanceObligation = {
  id: string
  name: string
  description: string
  amount: number
  outstanding_amount: number
  currency: string
  due_date: string | null
  status: FinanceObligationStatus
  source_module: FinanceSourceModule
}

export type FinanceCommitment = {
  id: string
  title: string
  description: string | null
  amount: number | null
  currency: string
  due_date: string | null
  status: FinanceCommitmentStatus
  priority: FinanceCommitmentPriority
  commitment_nature: FinanceCommitmentNature
  commitment_risk_level: FinanceCommitmentRiskLevel
  commitment_domain: FinanceCommitmentDomain
  commitment_category: FinanceCommitmentCategory
  industry: FinanceCommitmentIndustry
  industry_body: FinanceCommitmentIndustryBody
  commitment_type: FinanceCommitmentType
  related_module: string | null
  related_entity_type: string | null
  related_entity_id: string | null
  created_at: string
}

export type WorkspaceFinanceSummary = {
  income_total: number
  expense_total: number
  receivables_total: number
  payables_total: number
  commitments_total: number
  net_position: number
  currency: string
}

export type WorkspaceMoneyStateStatus =
  | "stable"
  | "attention"
  | "pressure"
  | "at_risk"
  | "unknown"

export type WorkspaceMoneyStateFlags = {
  has_overdue_commitments: boolean
  has_critical_commitments: boolean
  has_outstanding_payables: boolean
  has_negative_recorded_position: boolean
  has_possible_overlap_between_commitments_and_payables: boolean
}

export type WorkspaceMoneyState = {
  currency: string
  recorded_income_total: number
  recorded_expense_total: number
  recorded_net_position: number
  expected_receivables_total: number
  outstanding_payables_total: number
  open_commitments_total: number
  mandatory_commitments_total: number
  high_risk_commitments_total: number
  responsibility_pressure_total: number
  recorded_position_after_responsibilities: number
  status: WorkspaceMoneyStateStatus
  flags: WorkspaceMoneyStateFlags
  disclaimer: string
}

export type WorkspaceMoneyStateResponse = {
  success: true
  source: "finance_money_state_v0"
  mode: "recorded_awareness"
  money_state: WorkspaceMoneyState
}

export type WorkspaceFinanceDashboard = {
  success: true
  source: typeof WORKSPACE_FINANCE_SOURCE
  summary: WorkspaceFinanceSummary
  accounts: FinanceAccount[]
  categories: FinanceCategory[]
  recent_transactions: FinanceTransaction[]
  payables: FinanceObligation[]
  receivables: FinanceObligation[]
  commitments: FinanceCommitment[]
}

export type CreateFinanceItemInput = {
  item_type?: "income" | "expense" | "payable" | "receivable"
  amount?: number
  currency?: string
  description?: string
  category?: string
  transaction_date?: string
  due_date?: string
  counterparty_name?: string
}

export type CreateFinanceCommitmentInput = {
  title?: string
  description?: string
  amount?: number | string | null
  currency?: string
  due_date?: string
  status?: FinanceCommitmentStatus
  priority?: FinanceCommitmentPriority
  commitment_nature?: FinanceCommitmentNature
  commitment_risk_level?: FinanceCommitmentRiskLevel
  commitment_domain?: FinanceCommitmentDomain
  commitment_category?: FinanceCommitmentCategory
  industry?: FinanceCommitmentIndustry
  industry_body?: FinanceCommitmentIndustryBody
  commitment_type?: FinanceCommitmentType
  related_module?: string
  related_entity_type?: string
  related_entity_id?: string
}

export type UpdateFinanceCommitmentActionInput = {
  action?: FinanceCommitmentAction
}
