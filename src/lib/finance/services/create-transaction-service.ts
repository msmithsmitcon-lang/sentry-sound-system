import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { createFinanceAuditEvent } from "@/lib/finance/audit/create-finance-audit-event"
import type { ValidatedCreateFinanceTransaction } from "@/lib/finance/validation/create-transaction-validation"

export type CreateFinanceTransactionResult = {
  id: string
  description: string
  amount: number
  referenceType: string
  createdAt: string
}

export async function createFinanceTransaction(
  input: ValidatedCreateFinanceTransaction,
  context: {
    actorId: string
    workspaceId: string
  }
): Promise<CreateFinanceTransactionResult> {

  const { data, error } = await supabaseAdmin
    .from("finance_transactions")
    .insert({
      description: input.description,
      amount: input.amount,
      reference_type: input.referenceType,
      debit_account_id: input.debitAccountId ?? null,
      credit_account_id: input.creditAccountId ?? null,
      reconciliation_status: "posted",
    })
    .select(`
      id,
      description,
      amount,
      reference_type,
      created_at
    `)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const result: CreateFinanceTransactionResult = {
    id: data.id,
    description: data.description,
    amount: Number(data.amount),
    referenceType: data.reference_type,
    createdAt: data.created_at,
  }

  await createFinanceAuditEvent({
    eventType: "transaction.created",
    entityType: "finance_transaction",
    entityId: result.id,
    actorId: context.actorId,
    workspaceId: context.workspaceId,
    after: result,
    metadata: {
      source: "protected_finance_api",
    },
  })

  return result
}
