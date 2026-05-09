import { validateUpdateFinanceTransactionInput } from "../../src/lib/finance/validation/update-transaction-validation.ts"

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

const valid = validateUpdateFinanceTransactionInput({
  description: "Updated transaction",
  amount: 250,
  reconciliationStatus: "posted",
})

assert(valid.description === "Updated transaction", "description should validate")
assert(valid.amount === 250, "amount should validate")
assert(valid.reconciliationStatus === "posted", "status should validate")

try {
  validateUpdateFinanceTransactionInput({})
  throw new Error("empty update should fail")
} catch (error) {
  assert(error.message === "NO_VALID_UPDATE_FIELDS", "empty update error expected")
}

try {
  validateUpdateFinanceTransactionInput({
    amount: -1,
  })
  throw new Error("negative amount should fail")
} catch (error) {
  assert(error.message === "VALID_AMOUNT_REQUIRED", "amount error expected")
}

console.log("Update transaction validation tests passed.")
