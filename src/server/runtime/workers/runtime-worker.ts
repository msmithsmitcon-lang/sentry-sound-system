import { supabaseAdmin } from "../../../lib/supabaseAdmin";

const WORKER_ID =
  process.env.RUNTIME_WORKER_ID ||
  `worker-${crypto.randomUUID()}`;

const HEARTBEAT_INTERVAL_MS = 10000;
const LEASE_SECONDS = 30;
const POLL_INTERVAL_MS = 3000;

let running = true;

async function heartbeat() {
  await supabaseAdmin.rpc("rpc_ai_upsert_worker", {
    p_worker_id: WORKER_ID,
    p_status: "active",
    p_lease_seconds: LEASE_SECONDS,
  });
}

async function claimTask() {
  const { data, error } = await supabaseAdmin.rpc(
    "rpc_ai_claim_next_task",
    {
      p_worker_id: WORKER_ID,
    }
  );

  if (error) {
    console.error("CLAIM_ERROR", error);
    return null;
  }

  return Array.isArray(data) ? data[0] : data;
}

async function processTask(task: any) {
  console.log("PROCESSING_TASK", task?.task_id);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const { error } = await supabaseAdmin.rpc(
  "rpc_ai_complete_task",
  {
    p_task_id: task.task_id,
    p_result: JSON.parse(JSON.stringify({ success: true })),
  }
);

  if (error) {
    console.error("COMPLETE_ERROR", error);
  }
}

async function workerLoop() {
  while (running) {
    try {
      const task = await claimTask();

      if (task) {
        await processTask(task);
      } else {
        await sleep(POLL_INTERVAL_MS);
      }
    } catch (error) {
      console.error("WORKER_LOOP_ERROR", error);
      await sleep(POLL_INTERVAL_MS);
    }
  }
}

async function heartbeatLoop() {
  while (running) {
    try {
      await heartbeat();
    } catch (error) {
      console.error("HEARTBEAT_ERROR", error);
    }

    await sleep(HEARTBEAT_INTERVAL_MS);
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function startRuntimeWorker() {
  console.log("STARTING_RUNTIME_WORKER", WORKER_ID);

  await heartbeat();

  heartbeatLoop();

  await workerLoop();
}


