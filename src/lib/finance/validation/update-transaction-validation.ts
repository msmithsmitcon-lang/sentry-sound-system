export type UpdateFinanceTransactionInput = {
  description?: string
  amount?: number
  reconciliationStatus?: "posted" | "reconciled" | "void"
}

export type ValidatedUpdateFinanceTransaction = {
  description?: string
  amount?: number
  reconciliationStatus?: "posted" | "reconciled" | "void"
}

const allowedStatuses = ["posted", "reconciled", "void"]

export function validateUpdateFinanceTransactionInput(
  input: Partial<UpdateFinanceTransactionInput>
): ValidatedUpdateFinanceTransaction {
  const update: ValidatedUpdateFinanceTransaction = {}

  if (typeof input.description === "string") {
    const description = input.description.trim().slice(0, 200)

    if (!description) {
      throw new Error("DESCRIPTION_CANNOT_BE_EMPTY")
    }

    update.description = description
  }

  if (input.amount !== undefined) {
    const amount = Number(input.amount)

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("VALID_AMOUNT_REQUIRED")
    }

    update.amount = amount
  }

  if (input.reconciliationStatus !== undefined) {
    if (!allowedStatuses.includes(input.reconciliationStatus)) {
      throw new Error("VALID_RECONCILIATION_STATUS_REQUIRED")
    }

    update.reconciliationStatus = input.reconciliationStatus
  }

  if (Object.keys(update).length === 0) {
    throw new Error("NO_VALID_UPDATE_FIELDS")
  }

  return update
}
