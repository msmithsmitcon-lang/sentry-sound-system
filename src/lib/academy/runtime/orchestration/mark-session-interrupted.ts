import { RecoverableRuntimeSession }
from "./recoverable-runtime-session"

export function markSessionInterrupted(
  session: RecoverableRuntimeSession
): RecoverableRuntimeSession {

  return {
    ...session,

    interrupted: true,

    resumable: true,

    lastInteractionAt:
      new Date().toISOString(),
  }
}
