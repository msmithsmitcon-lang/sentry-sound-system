import dotenv from "dotenv"

dotenv.config({
  path: ".env.local",
})

const { createFinanceAuditEvent } =
  await import("../../src/lib/finance/audit/create-finance-audit-event.ts")

const event =
  await createFinanceAuditEvent({
    eventType: "transaction.created",
    entityType: "finance_transaction",
    entityId: "tx_test_001",
    actorId: "system_test",
    workspaceId: "workspace_test",
    after: {
      amount: 999,
      currency: "ZAR",
    },
  })

console.log(JSON.stringify(event, null, 2))
