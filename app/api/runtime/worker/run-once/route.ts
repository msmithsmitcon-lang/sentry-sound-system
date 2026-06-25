import { NextResponse } from "next/server";
import { claimTask, processTask } from "../../../../../src/server/runtime/workers/runtime-worker";

export async function POST() {
  const task = await claimTask();

  if (!task) {
    return NextResponse.json({
      ok: true,
      status: "no_task_found",
    });
  }

  await processTask(task);

  return NextResponse.json({
    ok: true,
    status: "task_processed",
    taskId: task.task_id,
  });
}
