import { createFinanceAuditEvent } from "../../src/lib/finance/audit/create-finance-audit-event.ts"

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

const event =
  await createFinanceAuditEvent({
    eventType:
      "transaction.created",

    entityType:
      "finance_transaction",

    entityId:
      "tx_123",

    actorId:
      "user_123",

    workspaceId:
      "workspace_123",

    after: {
      amount: 100,
    },
  })

assert(event.id, "event id required")

assert(
  event.eventType ===
    "transaction.created",
  "event type should match"
)

assert(
  event.entityId ===
    "tx_123",
  "entity id should match"
)

console.log(
  "Finance audit event tests passed."
)
