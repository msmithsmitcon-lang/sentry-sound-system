import { RecoverableRuntimeSession }
from "./recoverable-runtime-session"

export function recoverRuntimeSession(
  session: RecoverableRuntimeSession
): RecoverableRuntimeSession {

  return {
    ...session,

    interrupted: false,

    recoveredAt:
      new Date().toISOString(),
  }
}
