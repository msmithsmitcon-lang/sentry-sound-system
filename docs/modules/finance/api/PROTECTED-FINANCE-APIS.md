# Protected Finance APIs

## Purpose
Protected Finance APIs expose backend finance data only through authenticated, workspace-scoped, audited routes.

## Rules
- No public finance endpoints
- Every request must resolve authenticated user
- Every request must resolve workspace access
- Every mutation must create audit trail
- API responses must use stable contracts for future AI-assisted UI generation
- UI must consume contracts, not raw database shape

## Initial API Areas
1. Finance dashboard summary
2. Transactions
3. Receivables
4. Payables
5. Approvals
6. Reports queue
7. Finance health

## Protection Layers
1. Auth guard
2. Workspace membership guard
3. Role/permission guard
4. Input validation
5. Service-layer execution
6. Audit event
7. Contract response
