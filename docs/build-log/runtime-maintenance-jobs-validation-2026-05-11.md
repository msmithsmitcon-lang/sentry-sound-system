# Runtime Maintenance Jobs Validation

Date: 2026-05-11

## Validated

- rpc_ai_sweep_stale_locks exists
- rpc_ai_get_expired_workers exists
- rpc_ai_mark_expired_workers operational
- expired workers are marked correctly
- worker health snapshot reflects expired state

## Workers marked expired

- worker-local-001
- worker-109b5a0a-1204-4e70-8b6e-69f7ff278e51
- worker-84ca91f8-5952-4c9c-b764-05228263c3d5

## Boundary

Maintenance jobs are governance/supervision operations.
They do not alter execution contracts.
They do not replace ai_task_queue.
Worker remains a dumb executor.
