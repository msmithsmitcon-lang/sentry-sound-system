# Runtime Control Plane + Governance Layer

## Locked boundary

Execution plane stays unchanged:

ai_tasks
-> ai_task_queue
-> rpc_ai_claim_next_task
-> runtime worker
-> rpc_ai_complete_task

## Next build order

1. stale lock sweeper
2. retry governance
3. max retry enforcement
4. dead-letter queue
5. replay tooling
6. worker health APIs
7. runtime analytics APIs
8. execution tracing
9. queue observability
10. tenant quota enforcement
11. concurrency governance
12. daemon supervision
13. cleanup jobs
14. operational tooling
15. runtime dashboard backend

## Rule

No new queue abstraction.
Governance sits above execution.
Worker remains dumb executor.
