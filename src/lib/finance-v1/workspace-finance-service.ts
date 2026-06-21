import {
  createWorkspaceFinanceCommitment,
  createWorkspaceFinanceItem,
  ensureWorkspaceFinanceDefaults,
  getWorkspaceFinanceAccounts,
  getWorkspaceFinanceCategories,
  getWorkspaceFinanceCommitments,
  getWorkspaceFinancePayables,
  getWorkspaceFinanceReceivables,
  getWorkspaceFinanceSummary,
  getWorkspaceFinanceTransactions,
  syncFinanceCommitmentCalendarAction,
  updateWorkspaceFinanceCommitmentStatus,
} from "./workspace-finance-repository"
import {
  WORKSPACE_FINANCE_SOURCE,
  financeCommitmentCategories,
  financeCommitmentDomainOptions,
  financeCommitmentDomains,
  financeCommitmentIndustries,
  financeCommitmentIndustryBodies,
  financeCommitmentNatures,
  financeCommitmentPriorities,
  financeCommitmentRiskLevels,
  financeCommitmentStatuses,
  financeCommitmentTypes,
  type CreateFinanceCommitmentInput,
  type CreateFinanceItemInput,
  type FinanceCommitmentAction,
  type UpdateFinanceCommitmentActionInput,
  type WorkspaceFinanceDashboard,
} from "./workspace-finance.types"

type FinanceContext = {
  workspaceId: string
  userId: string
  currency?: string | null
}

const itemTypes = new Set(["income", "expense", "payable", "receivable"])
const commitmentStatuses = new Set(financeCommitmentStatuses)
const commitmentPriorities = new Set(financeCommitmentPriorities)
const commitmentCategories = new Set(financeCommitmentCategories)
const commitmentDomains = new Set(financeCommitmentDomains)
const commitmentNatures = new Set(financeCommitmentNatures)
const commitmentRiskLevels = new Set(financeCommitmentRiskLevels)
const commitmentIndustries = new Set(financeCommitmentIndustries)
const commitmentIndustryBodies = new Set(financeCommitmentIndustryBodies)
const commitmentTypes = new Set(financeCommitmentTypes)
const commitmentActions = new Set<FinanceCommitmentAction>([
  "mark_paid",
  "cancel",
  "review_later",
])

export async function getWorkspaceFinanceDashboard(
  context: FinanceContext
): Promise<WorkspaceFinanceDashboard> {
  const currency = context.currency || "ZAR"

  await ensureWorkspaceFinanceDefaults({
    workspaceId: context.workspaceId,
    userId: context.userId,
    currency,
  })

  const [summary, accounts, categories, recentTransactions, payables, receivables, commitments] =
    await Promise.all([
      getWorkspaceFinanceSummary(context.workspaceId, currency),
      getWorkspaceFinanceAccounts(context.workspaceId),
      getWorkspaceFinanceCategories(context.workspaceId),
      getWorkspaceFinanceTransactions(context.workspaceId),
      getWorkspaceFinancePayables(context.workspaceId),
      getWorkspaceFinanceReceivables(context.workspaceId),
      getWorkspaceFinanceCommitments(context.workspaceId),
    ])

  return {
    success: true,
    source: WORKSPACE_FINANCE_SOURCE,
    summary,
    accounts,
    categories,
    recent_transactions: recentTransactions,
    payables,
    receivables,
    commitments,
  }
}

export async function createWorkspaceFinanceRecord(
  context: FinanceContext,
  rawItem: CreateFinanceItemInput
) {
  const currency = context.currency || "ZAR"

  await ensureWorkspaceFinanceDefaults({
    workspaceId: context.workspaceId,
    userId: context.userId,
    currency,
  })

  const categories = await getWorkspaceFinanceCategories(context.workspaceId)
  const item = normalizeFinanceItem(rawItem, currency)

  if (
    (item.item_type === "income" || item.item_type === "expense") &&
    !categories.some(
      (category) =>
        category.category_type === item.item_type &&
        category.name === item.category
    )
  ) {
    throw new Error(`${item.item_type} category is not supported.`)
  }

  await createWorkspaceFinanceItem({
    workspaceId: context.workspaceId,
    userId: context.userId,
    currency,
    item,
  })

  return getWorkspaceFinanceDashboard(context)
}

export async function getWorkspaceFinanceCommitmentList(context: FinanceContext) {
  const currency = context.currency || "ZAR"

  await ensureWorkspaceFinanceDefaults({
    workspaceId: context.workspaceId,
    userId: context.userId,
    currency,
  })

  const commitments = await getWorkspaceFinanceCommitments(context.workspaceId)

  return {
    success: true,
    source: WORKSPACE_FINANCE_SOURCE,
    commitments,
  }
}

export async function createWorkspaceFinanceCommitmentRecord(
  context: FinanceContext,
  rawCommitment: CreateFinanceCommitmentInput
) {
  const currency = context.currency || "ZAR"

  await ensureWorkspaceFinanceDefaults({
    workspaceId: context.workspaceId,
    userId: context.userId,
    currency,
  })

  const commitment = normalizeFinanceCommitment(rawCommitment, currency)

  const created = await createWorkspaceFinanceCommitment({
    workspaceId: context.workspaceId,
    userId: context.userId,
    currency,
    commitment,
  })

  await syncFinanceCommitmentCalendarAction({
    workspaceId: context.workspaceId,
    userId: context.userId,
    currency,
    commitment: created,
  })

  return {
    success: true,
    source: WORKSPACE_FINANCE_SOURCE,
    commitment: created,
  }
}

export async function updateWorkspaceFinanceCommitmentAction(
  context: FinanceContext,
  commitmentId: string,
  rawAction: UpdateFinanceCommitmentActionInput
) {
  const currency = context.currency || "ZAR"
  const action = commitmentActions.has(rawAction.action as FinanceCommitmentAction)
    ? rawAction.action
    : undefined

  if (!action) {
    throw new Error("commitment action is required.")
  }

  const nextStatus =
    action === "mark_paid"
      ? "paid"
      : action === "cancel"
        ? "cancelled"
        : "review_later"
  const dueDate = action === "review_later" ? addDaysKey(14) : undefined

  const commitment = await updateWorkspaceFinanceCommitmentStatus({
    workspaceId: context.workspaceId,
    userId: context.userId,
    currency,
    commitmentId,
    status: nextStatus,
    dueDate,
  })

  if (!commitment) {
    throw new Error("Finance commitment not found.")
  }

  await syncFinanceCommitmentCalendarAction({
    workspaceId: context.workspaceId,
    userId: context.userId,
    currency,
    commitment,
  })

  return {
    success: true,
    source: WORKSPACE_FINANCE_SOURCE,
    commitment,
  }
}

function normalizeFinanceItem(
  rawItem: CreateFinanceItemInput,
  currency: string
): Required<Pick<CreateFinanceItemInput, "item_type" | "amount" | "description">> &
  CreateFinanceItemInput {
  const itemType = itemTypes.has(String(rawItem.item_type))
    ? rawItem.item_type
    : undefined
  const amount = Number(rawItem.amount ?? 0)
  const description = normalizeText(rawItem.description)
  const category = normalizeText(rawItem.category)

  if (!itemType) {
    throw new Error("item_type is required.")
  }

  if (amount <= 0) {
    throw new Error("amount must be greater than 0.")
  }

  if (!description) {
    throw new Error("description is required.")
  }

  if ((itemType === "income" || itemType === "expense") && !category) {
    throw new Error(`${itemType} category is required.`)
  }

  return {
    item_type: itemType,
    amount,
    description,
    currency: normalizeText(rawItem.currency) || currency,
    category,
    transaction_date: normalizeDate(rawItem.transaction_date) || todayKey(),
    due_date: normalizeDate(rawItem.due_date),
    counterparty_name: normalizeText(rawItem.counterparty_name),
  }
}

function normalizeFinanceCommitment(
  rawCommitment: CreateFinanceCommitmentInput,
  currency: string
) {
  const title = normalizeText(rawCommitment.title)
  const amount =
    rawCommitment.amount === null || rawCommitment.amount === undefined || rawCommitment.amount === ""
      ? null
      : Number(rawCommitment.amount)
  const status = commitmentStatuses.has(String(rawCommitment.status))
    ? rawCommitment.status
    : "planned"
  const priority = commitmentPriorities.has(String(rawCommitment.priority))
    ? rawCommitment.priority
    : "normal"
  const commitmentDomain = commitmentDomains.has(
    String(rawCommitment.commitment_domain)
  )
    ? rawCommitment.commitment_domain
    : undefined
  const domainOption = financeCommitmentDomainOptions.find(
    (option) => option.value === commitmentDomain
  )
  const typeOption = domainOption?.types.find(
    (option) => option.value === rawCommitment.commitment_type
  )
  const commitmentCategory =
    commitmentCategories.has(String(rawCommitment.commitment_category)) &&
    rawCommitment.commitment_category === domainOption?.category
      ? rawCommitment.commitment_category
      : domainOption?.category
  const industry = commitmentIndustries.has(String(rawCommitment.industry))
    ? rawCommitment.industry
    : "music"
  const industryBody = commitmentIndustryBodies.has(
    String(rawCommitment.industry_body)
  )
    ? rawCommitment.industry_body
    : "none"
  const commitmentType = commitmentTypes.has(String(rawCommitment.commitment_type))
    ? rawCommitment.commitment_type
    : undefined
  const commitmentNature = commitmentNatures.has(
    String(rawCommitment.commitment_nature)
  )
    ? rawCommitment.commitment_nature
    : typeOption?.defaultNature
  const commitmentRiskLevel = commitmentRiskLevels.has(
    String(rawCommitment.commitment_risk_level)
  )
    ? rawCommitment.commitment_risk_level
    : typeOption?.defaultRiskLevel
  const relatedEntityId = normalizeUuid(rawCommitment.related_entity_id)

  if (!title) {
    throw new Error("commitment title is required.")
  }

  if (amount !== null && (!Number.isFinite(amount) || amount < 0)) {
    throw new Error("commitment amount must be zero or greater.")
  }

  if (!commitmentDomain || !domainOption) {
    throw new Error("commitment domain is required.")
  }

  if (!commitmentType) {
    throw new Error("commitment type is required.")
  }

  if (!typeOption) {
    throw new Error("commitment type is not valid for selected domain.")
  }

  if (!commitmentCategory) {
    throw new Error("commitment category is required.")
  }

  if (!commitmentNature) {
    throw new Error("commitment nature is required.")
  }

  if (!commitmentRiskLevel) {
    throw new Error("commitment risk level is required.")
  }

  return {
    title,
    description: normalizeText(rawCommitment.description) || null,
    amount,
    currency: normalizeText(rawCommitment.currency) || currency,
    due_date: normalizeDate(rawCommitment.due_date) || null,
    status,
    priority,
    commitment_nature: commitmentNature,
    commitment_risk_level: commitmentRiskLevel,
    commitment_domain: commitmentDomain,
    commitment_category: commitmentCategory,
    industry,
    industry_body: industryBody,
    commitment_type: commitmentType,
    related_module: normalizeText(rawCommitment.related_module) || null,
    related_entity_type: normalizeText(rawCommitment.related_entity_type) || null,
    related_entity_id: relatedEntityId || null,
  }
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function normalizeDate(value: unknown) {
  if (typeof value !== "string") return ""
  const trimmed = value.trim()
  return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : ""
}

function normalizeUuid(value: unknown) {
  if (typeof value !== "string") return ""
  const trimmed = value.trim()
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(trimmed)
    ? trimmed
    : ""
}

function todayKey() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function addDaysKey(days: number) {
  const next = new Date()
  next.setDate(next.getDate() + days)
  const year = next.getFullYear()
  const month = String(next.getMonth() + 1).padStart(2, "0")
  const day = String(next.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
