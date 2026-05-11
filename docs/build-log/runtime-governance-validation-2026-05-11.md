# Runtime Governance Validation — Retry + Dead Letter

Date: 2026-05-11

## Validated

- rpc_ai_fail_or_retry_task works
- retry 1 returns pending
- retry 2 returns pending
- retry 3 returns failed
- failed task is inserted into ai_dead_letter_queue
- escalation_status defaults to pending_review
- canonical dead-letter table is ai_dead_letter_queue

## Test task

e126525d-04bd-4d7c-8a14-da59523ec8cf

## Important correction

ai_task_dead_letters was created accidentally during governance build.
It was removed.
Do not use it.

## Canonical governance table

ai_dead_letter_queue
