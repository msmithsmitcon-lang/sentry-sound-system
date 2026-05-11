select id, status, available_at, worker_id, lock_expires_at, created_at
from ai_runtime_tasks
order by created_at desc
limit 20;