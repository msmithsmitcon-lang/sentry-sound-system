import { prisma } from "@/lib/db/prisma"

import type {
  CreateFinanceItemInput,
  FinanceAccount,
  FinanceCategory,
  FinanceCommitment,
  FinanceCommitmentStatus,
  FinanceObligation,
  FinanceTransaction,
  WorkspaceFinanceSummary,
} from "./workspace-finance.types"

type FinanceContext = {
  workspaceId: string
  userId: string
  currency: string
}

const defaultAccounts = [
  ["Operating Cash", "cash"],
  ["Income", "income"],
  ["Expenses", "expense"],
  ["Payables", "payable"],
  ["Receivables", "receivable"],
] as const

const defaultIncomeCategories = [
  "Streaming Revenue",
  "Performance Royalties",
  "Mechanical Royalties",
  "Sync / Licensing",
  "Publishing Income",
  "Distribution Income",
  "Sales / Downloads",
  "Service Income",
  "Sponsorship / Brand Deal",
  "Other Income",
] as const

const defaultExpenseCategories = [
  "Studio / Recording",
  "Mixing / Mastering",
  "Session Musicians",
  "Marketing / Promotion",
  "Distribution Fees",
  "Software / Subscriptions",
  "Equipment",
  "Travel",
  "Legal / Admin",
  "Office / Operations",
  "Other Expense",
] as const

export async function ensureWorkspaceFinanceDefaults(input: FinanceContext) {
  for (const [accountName, accountType] of defaultAccounts) {
    await prisma.$executeRaw`
      INSERT INTO workspace_finance_accounts (
        workspace_id,
        account_name,
        account_type,
        currency,
        created_by_user_id
      )
      VALUES (
        ${input.workspaceId}::uuid,
        ${accountName},
        ${accountType},
        ${input.currency},
        ${input.userId}
      )
      ON CONFLICT (workspace_id, account_name, account_type) DO NOTHING
    `
  }

  for (const categoryName of defaultIncomeCategories) {
    await prisma.$executeRaw`
      INSERT INTO workspace_finance_categories (
        workspace_id,
        name,
        category_type,
        created_by_user_id
      )
      VALUES (
        ${input.workspaceId}::uuid,
        ${categoryName},
        'income',
        ${input.userId}
      )
      ON CONFLICT (workspace_id, name, category_type) DO NOTHING
    `
  }

  for (const categoryName of defaultExpenseCategories) {
    await prisma.$executeRaw`
      INSERT INTO workspace_finance_categories (
        workspace_id,
        name,
        category_type,
        created_by_user_id
      )
      VALUES (
        ${input.workspaceId}::uuid,
        ${categoryName},
        'expense',
        ${input.userId}
      )
      ON CONFLICT (workspace_id, name, category_type) DO NOTHING
    `
  }
}

export async function getWorkspaceFinanceSummary(
  workspaceId: string,
  currency: string
): Promise<WorkspaceFinanceSummary> {
  const rows = await prisma.$queryRaw<Array<{
    income_total: number | string | null
    expense_total: number | string | null
    receivables_total: number | string | null
    payables_total: number | string | null
    commitments_total: number | string | null
  }>>`
    SELECT
      COALESCE((
        SELECT SUM(amount)
        FROM workspace_finance_transactions
        WHERE workspace_id = ${workspaceId}::uuid
          AND transaction_type = 'income'
          AND status <> 'cancelled'
      ), 0) AS income_total,
      COALESCE((
        SELECT SUM(amount)
        FROM workspace_finance_transactions
        WHERE workspace_id = ${workspaceId}::uuid
          AND transaction_type = 'expense'
          AND status <> 'cancelled'
      ), 0) AS expense_total,
      COALESCE((
        SELECT SUM(outstanding_amount)
        FROM workspace_finance_receivables
        WHERE workspace_id = ${workspaceId}::uuid
          AND status <> 'cancelled'
      ), 0) AS receivables_total,
      COALESCE((
        SELECT SUM(outstanding_amount)
        FROM workspace_finance_payables
        WHERE workspace_id = ${workspaceId}::uuid
          AND status <> 'cancelled'
      ), 0) AS payables_total,
      COALESCE((
        SELECT SUM(amount)
        FROM workspace_finance_commitments
        WHERE workspace_id = ${workspaceId}::uuid
          AND status NOT IN ('paid', 'cancelled')
      ), 0) AS commitments_total
  `

  const row = rows[0] ?? {
    income_total: 0,
    expense_total: 0,
    receivables_total: 0,
    payables_total: 0,
    commitments_total: 0,
  }

  const incomeTotal = toNumber(row.income_total)
  const expenseTotal = toNumber(row.expense_total)
  const receivablesTotal = toNumber(row.receivables_total)
  const payablesTotal = toNumber(row.payables_total)
  const commitmentsTotal = toNumber(row.commitments_total)

  return {
    income_total: incomeTotal,
    expense_total: expenseTotal,
    receivables_total: receivablesTotal,
    payables_total: payablesTotal,
    commitments_total: commitmentsTotal,
    net_position: incomeTotal - expenseTotal,
    currency,
  }
}

export async function getWorkspaceFinanceAccounts(
  workspaceId: string
): Promise<FinanceAccount[]> {
  const rows = await prisma.$queryRaw<Array<FinanceAccount & {
    current_balance: number | string
  }>>`
    SELECT
      id,
      account_name,
      account_type,
      currency,
      current_balance,
      is_active
    FROM workspace_finance_accounts
    WHERE workspace_id = ${workspaceId}::uuid
    ORDER BY account_type ASC, account_name ASC
  `

  return rows.map((row) => ({
    ...row,
    current_balance: toNumber(row.current_balance),
  }))
}

export async function getWorkspaceFinanceCategories(
  workspaceId: string
): Promise<FinanceCategory[]> {
  return prisma.$queryRaw<FinanceCategory[]>`
    SELECT
      id,
      name,
      category_type
    FROM workspace_finance_categories
    WHERE workspace_id = ${workspaceId}::uuid
      AND is_active = true
    ORDER BY category_type ASC, name ASC
  `
}

export async function getWorkspaceFinanceTransactions(
  workspaceId: string
): Promise<FinanceTransaction[]> {
  const rows = await prisma.$queryRaw<Array<Omit<FinanceTransaction, "amount" | "created_at"> & {
    amount: number | string
    created_at: Date | string
  }>>`
    SELECT
      id,
      transaction_type,
      amount,
      currency,
      transaction_date::text,
      description,
      category,
      status,
      source_module,
      related_entity_type,
      related_entity_id,
      created_at
    FROM workspace_finance_transactions
    WHERE workspace_id = ${workspaceId}::uuid
    ORDER BY transaction_date DESC, created_at DESC
    LIMIT 12
  `

  return rows.map((row) => ({
    ...row,
    amount: toNumber(row.amount),
    created_at: normalizeDateTime(row.created_at),
  }))
}

export async function getWorkspaceFinancePayables(
  workspaceId: string
): Promise<FinanceObligation[]> {
  const rows = await prisma.$queryRaw<Array<{
    id: string
    vendor_name: string
    description: string
    amount: number | string
    outstanding_amount: number | string
    currency: string
    due_date: string | null
    status: FinanceObligation["status"]
    source_module: FinanceObligation["source_module"]
  }>>`
    SELECT
      id,
      vendor_name,
      description,
      amount,
      outstanding_amount,
      currency,
      due_date::text,
      status,
      source_module
    FROM workspace_finance_payables
    WHERE workspace_id = ${workspaceId}::uuid
    ORDER BY due_date ASC NULLS LAST, created_at DESC
    LIMIT 8
  `

  return rows.map((row) => ({
    id: row.id,
    name: row.vendor_name,
    description: row.description,
    amount: toNumber(row.amount),
    outstanding_amount: toNumber(row.outstanding_amount),
    currency: row.currency,
    due_date: row.due_date,
    status: row.status,
    source_module: row.source_module,
  }))
}

export async function getWorkspaceFinanceReceivables(
  workspaceId: string
): Promise<FinanceObligation[]> {
  const rows = await prisma.$queryRaw<Array<{
    id: string
    customer_name: string
    description: string
    amount: number | string
    outstanding_amount: number | string
    currency: string
    due_date: string | null
    status: FinanceObligation["status"]
    source_module: FinanceObligation["source_module"]
  }>>`
    SELECT
      id,
      customer_name,
      description,
      amount,
      outstanding_amount,
      currency,
      due_date::text,
      status,
      source_module
    FROM workspace_finance_receivables
    WHERE workspace_id = ${workspaceId}::uuid
    ORDER BY due_date ASC NULLS LAST, created_at DESC
    LIMIT 8
  `

  return rows.map((row) => ({
    id: row.id,
    name: row.customer_name,
    description: row.description,
    amount: toNumber(row.amount),
    outstanding_amount: toNumber(row.outstanding_amount),
    currency: row.currency,
    due_date: row.due_date,
    status: row.status,
    source_module: row.source_module,
  }))
}

export async function getWorkspaceFinanceCommitments(
  workspaceId: string
): Promise<FinanceCommitment[]> {
  const rows = await prisma.$queryRaw<Array<Omit<FinanceCommitment, "amount" | "created_at"> & {
    amount: number | string | null
    created_at: Date | string
  }>>`
    SELECT
      id,
      title,
      description,
      amount,
      currency,
      due_date::text,
      status,
      priority,
      commitment_nature,
      commitment_risk_level,
      commitment_domain,
      commitment_category,
      industry,
      industry_body,
      commitment_type,
      related_module,
      related_entity_type,
      related_entity_id,
      created_at
    FROM workspace_finance_commitments
    WHERE workspace_id = ${workspaceId}::uuid
    ORDER BY
      CASE status
        WHEN 'overdue' THEN 1
        WHEN 'due' THEN 2
        WHEN 'review_later' THEN 3
        WHEN 'planned' THEN 3
        WHEN 'paid' THEN 4
        ELSE 5
      END,
      due_date ASC NULLS LAST,
      created_at DESC
    LIMIT 16
  `

  return rows.map((row) => ({
    ...row,
    amount: row.amount === null ? null : toNumber(row.amount),
    created_at: normalizeDateTime(row.created_at),
  }))
}

export async function createWorkspaceFinanceItem(input: FinanceContext & {
  item: Required<Pick<CreateFinanceItemInput, "item_type" | "amount" | "description">> &
    CreateFinanceItemInput
}) {
  if (input.item.item_type === "payable") {
    const rows = await prisma.$queryRaw`
      INSERT INTO workspace_finance_payables (
        workspace_id,
        vendor_name,
        description,
        amount,
        outstanding_amount,
        currency,
        due_date,
        created_by_user_id
      )
      VALUES (
        ${input.workspaceId}::uuid,
        ${input.item.counterparty_name ?? "Unspecified vendor"},
        ${input.item.description},
        ${input.item.amount},
        ${input.item.amount},
        ${input.item.currency ?? input.currency},
        ${input.item.due_date ?? null}::date,
        ${input.userId}
      )
      RETURNING id
    `
    return rows
  }

  if (input.item.item_type === "receivable") {
    const rows = await prisma.$queryRaw`
      INSERT INTO workspace_finance_receivables (
        workspace_id,
        customer_name,
        description,
        amount,
        outstanding_amount,
        currency,
        due_date,
        created_by_user_id
      )
      VALUES (
        ${input.workspaceId}::uuid,
        ${input.item.counterparty_name ?? "Unspecified customer"},
        ${input.item.description},
        ${input.item.amount},
        ${input.item.amount},
        ${input.item.currency ?? input.currency},
        ${input.item.due_date ?? null}::date,
        ${input.userId}
      )
      RETURNING id
    `
    return rows
  }

  const rows = await prisma.$queryRaw`
    INSERT INTO workspace_finance_transactions (
      workspace_id,
      transaction_type,
      amount,
      currency,
      transaction_date,
      description,
      category,
      status,
      source_module,
      created_by_user_id
    )
    VALUES (
      ${input.workspaceId}::uuid,
      ${input.item.item_type},
      ${input.item.amount},
      ${input.item.currency ?? input.currency},
      ${input.item.transaction_date ?? null}::date,
      ${input.item.description},
      NULLIF(${input.item.category ?? ""}, ''),
      'posted',
      'manual',
      ${input.userId}
    )
    RETURNING id
  `

  return rows
}

export async function createWorkspaceFinanceCommitment(input: FinanceContext & {
  commitment: Omit<FinanceCommitment, "id" | "created_at">
}) {
  const rows = await prisma.$queryRaw<FinanceCommitment[]>`
    INSERT INTO workspace_finance_commitments (
      workspace_id,
      title,
      description,
      amount,
      currency,
      due_date,
      status,
      priority,
      commitment_nature,
      commitment_risk_level,
      commitment_domain,
      commitment_category,
      industry,
      industry_body,
      commitment_type,
      related_module,
      related_entity_type,
      related_entity_id,
      created_by_user_id
    )
    VALUES (
      ${input.workspaceId}::uuid,
      ${input.commitment.title},
      NULLIF(${input.commitment.description ?? ""}, ''),
      ${input.commitment.amount},
      ${input.commitment.currency || input.currency},
      ${input.commitment.due_date ?? null}::date,
      ${input.commitment.status},
      ${input.commitment.priority},
      ${input.commitment.commitment_nature},
      ${input.commitment.commitment_risk_level},
      ${input.commitment.commitment_domain},
      ${input.commitment.commitment_category},
      ${input.commitment.industry},
      ${input.commitment.industry_body},
      ${input.commitment.commitment_type},
      NULLIF(${input.commitment.related_module ?? ""}, ''),
      NULLIF(${input.commitment.related_entity_type ?? ""}, ''),
      ${input.commitment.related_entity_id ?? null}::uuid,
      ${input.userId}
    )
    RETURNING
      id,
      title,
      description,
      amount,
      currency,
      due_date::text,
      status,
      priority,
      commitment_nature,
      commitment_risk_level,
      commitment_domain,
      commitment_category,
      industry,
      industry_body,
      commitment_type,
      related_module,
      related_entity_type,
      related_entity_id,
      created_at
  `

  return rows[0]
}

export async function updateWorkspaceFinanceCommitmentStatus(input: FinanceContext & {
  commitmentId: string
  status: FinanceCommitmentStatus
  dueDate?: string | null
}) {
  const rows = await prisma.$queryRaw<Array<Omit<FinanceCommitment, "amount" | "created_at"> & {
    amount: number | string | null
    created_at: Date | string
  }>>`
    UPDATE workspace_finance_commitments
    SET
      status = ${input.status},
      due_date = COALESCE(${input.dueDate ?? null}::date, due_date),
      updated_at = now()
    WHERE id = ${input.commitmentId}::uuid
      AND workspace_id = ${input.workspaceId}::uuid
    RETURNING
      id,
      title,
      description,
      amount,
      currency,
      due_date::text,
      status,
      priority,
      commitment_nature,
      commitment_risk_level,
      commitment_domain,
      commitment_category,
      industry,
      industry_body,
      commitment_type,
      related_module,
      related_entity_type,
      related_entity_id,
      created_at
  `

  const row = rows[0]
  if (!row) return null

  return {
    ...row,
    amount: row.amount === null ? null : toNumber(row.amount),
    created_at: normalizeDateTime(row.created_at),
  }
}

export async function syncFinanceCommitmentCalendarAction(input: FinanceContext & {
  commitment: FinanceCommitment
}) {
  const actionStatus = commitmentStatusToCalendarAction(input.commitment.status)
  const legacyStatus = calendarActionToLegacyStatus(actionStatus)

  const existing = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT id
    FROM workspace_calendar_items
    WHERE workspace_id = ${input.workspaceId}::uuid
      AND source_module = 'finance'
      AND related_entity_type = 'finance_commitment'
      AND related_entity_id = ${input.commitment.id}::uuid
    ORDER BY created_at DESC
    LIMIT 1
  `

  if (input.commitment.status === "paid" || input.commitment.status === "cancelled") {
    if (existing[0]) {
      await prisma.$executeRaw`
        UPDATE workspace_calendar_items
        SET
          action_status = ${actionStatus},
          status = ${legacyStatus},
          completed_at = CASE
            WHEN ${input.commitment.status} = 'paid' THEN COALESCE(completed_at, now())
            ELSE completed_at
          END,
          updated_at = now()
        WHERE id = ${existing[0].id}::uuid
          AND workspace_id = ${input.workspaceId}::uuid
      `
    }
    return
  }

  if (!["due", "overdue", "review_later"].includes(input.commitment.status)) {
    return
  }

  const dueDate = input.commitment.due_date || todayKey()
  const title = `Finance: ${input.commitment.title}`
  const description = [
    input.commitment.description,
    `Category: ${input.commitment.commitment_category}`,
    `Domain: ${input.commitment.commitment_domain}`,
    `Nature: ${input.commitment.commitment_nature}`,
    `Risk: ${input.commitment.commitment_risk_level}`,
    `Type: ${input.commitment.commitment_type}`,
    input.commitment.industry_body !== "none"
      ? `Body: ${input.commitment.industry_body.toUpperCase()}`
      : "",
  ].filter(Boolean).join("\n")

  if (existing[0]) {
    await prisma.$executeRaw`
      UPDATE workspace_calendar_items
      SET
        title = ${title},
        description = NULLIF(${description}, ''),
        item_date = ${dueDate}::date,
        required_by_date = ${dueDate}::date,
        action_status = ${actionStatus},
        status = ${legacyStatus},
        priority = ${input.commitment.priority},
        category = 'finance',
        workflow_type = 'finance',
        updated_at = now()
      WHERE id = ${existing[0].id}::uuid
        AND workspace_id = ${input.workspaceId}::uuid
    `
    return
  }

  await prisma.$executeRaw`
    INSERT INTO workspace_calendar_items (
      workspace_id,
      title,
      description,
      item_date,
      required_by_date,
      status,
      action_status,
      category,
      workflow_type,
      priority,
      approval_required,
      assigned_to,
      source_module,
      related_entity_type,
      related_entity_id,
      created_by_user_id,
      metadata
    )
    VALUES (
      ${input.workspaceId}::uuid,
      ${title},
      NULLIF(${description}, ''),
      ${dueDate}::date,
      ${dueDate}::date,
      ${legacyStatus},
      ${actionStatus},
      'finance',
      'finance',
      ${input.commitment.priority},
      false,
      ${input.userId},
      'finance',
      'finance_commitment',
      ${input.commitment.id}::uuid,
      ${input.userId},
      jsonb_build_object(
        'source', 'finance_commitment',
        'commitment_category', ${input.commitment.commitment_category}::text,
        'commitment_domain', ${input.commitment.commitment_domain}::text,
        'commitment_nature', ${input.commitment.commitment_nature}::text,
        'commitment_risk_level', ${input.commitment.commitment_risk_level}::text,
        'commitment_type', ${input.commitment.commitment_type}::text,
        'industry', ${input.commitment.industry}::text,
        'industry_body', ${input.commitment.industry_body}::text
      )
    )
  `
}

function toNumber(value: number | string | null | undefined) {
  return Number(value ?? 0)
}

function normalizeDateTime(value: Date | string) {
  return value instanceof Date ? value.toISOString() : value
}

function commitmentStatusToCalendarAction(status: FinanceCommitmentStatus) {
  if (status === "paid") return "completed"
  if (status === "cancelled") return "cancelled"
  if (status === "overdue") return "overdue"
  return "pending"
}

function calendarActionToLegacyStatus(actionStatus: string) {
  if (actionStatus === "completed") return "done"
  if (actionStatus === "cancelled") return "cancelled"
  if (actionStatus === "overdue") return "open"
  return "open"
}

function todayKey() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
