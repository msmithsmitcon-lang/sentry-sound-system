import "dotenv/config";
import { startRuntimeWorker } from "@/server/runtime/workers/runtime-worker";

async function main() {
  await startRuntimeWorker();
}

main().catch((error) => {
  console.error("RUNTIME_WORKER_FATAL", error);
  process.exit(1);
});
